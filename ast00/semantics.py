import tokeniser
import dast

class Cursor:
	def __init__(self, in_arrayToken):
		self.arrayToken = in_arrayToken
		self.length = len(in_arrayToken)
		self.index = 0

	def isValid(self):
		return self.index < self.length

	def consume(self):
		token = self.arrayToken[self.index]
		self.index += 1
		return token

	def peekOrNone(self, delta):
		token = None
		if self.index + delta < self.length:
			token = self.arrayToken[self.index + delta]
		return token


#combine into one comment ast node
# or do we push comments into a bucket and append them to the last completed node? or next node

def jobIfndef(out_childArray, in_cursor, in_fileWrapper, in_environment):
	item = in_cursor.peek(0)
	if item and item.getTokenEnum() == tokeniser.TokenEnum.Preprocessor and item.getValue() == "#ifndef":
		in_cursor.consume()

		#collect tokens on the same line


		newChildArray = []
		convertTokenArrayToDAstTillPreprocessorScopeClose(newChildArray, in_cursor, in_fileWrapper, in_environment):
		out_childArray.append( dast.DAst( dast.DAstEnum.PreprocessorIfndef, , newChildArray, in_environment.consumeCommentArray() ) )

def jobIfdef(out_childArray, in_cursor, in_fileWrapper, in_environment):
	item = in_cursor.peek(0)
	if item and item.getTokenEnum() == tokeniser.TokenEnum.Preprocessor and item.getValue() == "#ifdef":
		in_cursor.consume()
		token = in_cursor.consume()
		newChildArray = []
		convertTokenArrayToDAstTillPreprocessorScopeClose(newChildArray, in_cursor, in_fileWrapper, in_environment):
		out_childArray.append( dast.DAst( dast.DAstEnum.PreprocessorIfdef, token.getValue(), newChildArray, in_environment.consumeCommentArray() ) )

def jobIf(out_childArray, in_cursor, in_fileWrapper, in_environment):
	item = in_cursor.peek(0)
	if item and item.getTokenEnum() == tokeniser.TokenEnum.Preprocessor and item.getValue() == "#if":
		in_cursor.consume()
		token = in_cursor.consume()
		newChildArray = []
		convertTokenArrayToDAstTillPreprocessorScopeClose(newChildArray, in_cursor, in_fileWrapper, in_environment):
		out_childArray.append( dast.DAst( dast.DAstEnum.PreprocessorIfdef, token.getValue(), newChildArray, in_environment.consumeCommentArray() ) )

def jobEndIf(out_childArray, in_cursor, in_fileWrapper, in_environment):
	item = in_cursor.peek(0)
	if item and item.getTokenEnum() == tokeniser.TokenEnum.Preprocessor and item.getValue() == "#endif":
		in_cursor.consume()
		out_childArray.append( dast.DAst( dast.DAstEnum.PreprocessorEndif, None, [], in_environment.consumeCommentArray() ) )

def jobInclude(out_childArray, in_cursor, in_fileWrapper, in_environment):
	item = in_cursor.peek(0)
	if item and item.getTokenEnum() == tokeniser.TokenEnum.Preprocessor and item.getValue() == "#include":
		in_cursor.consume()

		out_childArray.append( dast.DAst( dast.DAstEnum.PreprocessorInclude, None, [], in_environment.consumeCommentArray() ) )

s_semanticJob = list([
	jobIfndef,
	jobIfdef,
	jobIf,
	jobEndIf,
	jobInclude,
])

def runSemanticJobs(out_childArray, in_cursor, in_fileWrapper, in_environment):
	for job in s_semanticJob:
		addedDast = job(out_childArray, in_cursor, in_fileWrapper, in_environment):
		if addedDast:
			return
	token = in_cursor.consume()
	print("ERROR: could not handle token")
	print(token)

def skipComments(in_cursor, in_environment):
	value = []
	while True:
		item = in_cursor.peek(0)
		if item and item.getTokenEnum() == tokeniser.TokenEnum.Comment:
			in_environment.getCommentArray().append(item.getValue())
			in_cursor.consume()
		else:
			break

def convertTokenArrayToDAst(out_childArray, in_arrayToken, in_fileWrapper, in_environment):
	cursor = Cursor(in_arrayToken)
	while cursor.isValid():
		skipComments(cursor, in_environment)
		runSemanticJobs(out_childArray, cursor, in_fileWrapper, in_environment)
	if 0 < len(in_environment.getCommentArray()):
		out_childArray.append( dast.DAst( dast.DAstEnum.Comment, in_environment.consumeCommentArray() ) )

def convertTokenArrayToDAstTillPreprocessorScopeClose(out_childArray, in_cursor, in_fileWrapper, in_environment):
	while cursor.isValid():
		skipComments(cursor, in_environment)
		addedDast = runSemanticJobs(out_childArray, cursor, in_fileWrapper, in_environment)
		if addedDast and addedDast.getAstEnum() == dast.DAstEnum.PreprocessorEndif:
			return
		if addedDast and addedDast.getAstEnum() == dast.DAstEnum.PreprocessorElse:
			return
		if addedDast and addedDast.getAstEnum() == dast.DAstEnum.PreprocessorElif:
			return

