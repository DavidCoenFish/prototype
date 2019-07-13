# c++ treats comments as whitespace, we don't quite want that
# we could append the comments and insert them before/ after ast nodes?
# otherwise would have to allow comments anywhere....
#lets go with comments everywhere?
import enum

def isWhiteSpace( in_char):
def isString( in_char):
def isEndOfLineComment( in_char):
def isCommentStart( in_char):
def isCommentEnd( in_char):

def s_spaceCharSet = set([" ", "\t", "\n", "\v", "\f", "\r"])
def s_stringCharSet = set(["'", "\""])
def s_newlineCharSet = set(["\n", "\r"])
def s_lineContinueCharSet = set(["\\"])

#DOS and Windows '\r\n'
#Unix '\n'
#Mac '\r'.

#space is a superset of newline
class Cursor:
	def __init__(self, in_contents, in_file):
		self.contents = in_contents
		self.length = len(in_contents)
		self.index = 0
		self.file = in_file

	def isValid(self):
		return self.length <= self.index

	def advance(self, count):
		self.index += count

	def consume(self):
		value = self.contents[self.index]
		self.index += 1
		return value

	def isWhiteSpace(self):
		char = self.contents[self.index]
		return char in s_spaceCharSet

	def isLineContinueWindows(self):
		if self.index + 2 < self.length:
			charSequence = self.contents[self.index] + self.contents[self.index + 1] + self.contents[self.index + 2]
			return charSequence == "\\\r\n"
		return false

	def isLineContinue(self):
		if self.index + 1 < self.length:
			charSequence = self.contents[self.index] + self.contents[self.index + 1] + self.contents[self.index + 2]
			return charSequence == "\\\r" or charSequence == "\\\n"
		return false

	def isNewlineWindows(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "\r\n"
		return false

	def isNewline(self):
		char = self.contents[self.index]
		return char in s_newlineCharSet

	def isString(self):
		char = self.contents[self.index]
		return char in s_stringCharSet

	def isEndOfLineComment(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "//"
		return false

	def isCommentStart(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "/*"
		return false

	def isCommentEnd(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "*/"
		return false

#keywords, identifiers, literals, operators, punctuators
class TokenEnum(enum.Enum):
	Comment = 1
	String = 2
	Token = 3

class Token:
	def __init__(self, in_tokenEnum, in_value, in_line, in_file):
		self.tokenEnum = in_tokenEnum
		self.value = in_value
		self.line = in_line
		self.file = in_file

	def __str__(self):
		result = f"\n"
		result += f"Token\n"
		result += f"  tokenEnum:{self.tokenEnum}\n"
		result += f"  value:{self.value}\n"
		result += f"  line:{self.line}\n"
		result += f"  file:{self.file}\n"

class Tokeniser:
	def __init__(self, in_contents):
		self.cursor = Cursor(in_contents, in_file)
		self.line = 0
		self.file = in_file

	def __iter__(self):
		return self

	def __next__(self): # Python 2: def next(self)
		token = self.consumeToken()
		if not token:
			raise StopIteration
		return token

	def consumeToken(self): 
		if not self.cursor.isValid()
			return None

		#advance whitespace
		while self.cursor.isValid():
			if self.cursor.isNewlineWindows():
				self.line += 1
				self.cursor.advance(2)
			else if self.cursor.isNewline():
				self.line += 1
				self.cursor.advance(1)
			else if self.cursor.isWhiteSpace():
				self.cursor.advance(1)
			else:
				break

		if not self.cursor.isValid():
			return None

		#end of line comment
		if self.cursor.isEndOfLineComment():
			value = ""
			self.cursor.advance(2)
			while self.cursor.isValid():
				if self.cursor.isLineContinueWindows():
					self.cursor.advance(3)
				else if self.cursor.isLineContinue():
					self.cursor.advance(2)
				else if self.cursor.isNewlineWindows():
					self.cursor.advance(2)
					break
				else if self.cursor.isNewline():
					self.cursor.advance(1)
					break
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.Comment, value)

		#start end comments
		if self.cursor.isCommentStart():
			value = ""
			self.cursor.advance(2)
			while self.cursor.isValid():
				if self.cursor.isEndOfLineComment():
					self.cursor.advance(2)
					break
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.Comment, value)

		#string
		if self.cursor.isString():
			value = ""
			self.cursor.advance(1)
			while self.cursor.isValid():
				if self.cursor.isStringEscape():
					value += self.cursor.consume()
					value += self.cursor.consume()
				else if self.cursor.isString():
					self.cursor.advance(1)
					break
			return Token(TokenEnum.String, value)

		#token
		value = ""
		while self.cursor.isValid():
			if not self.cursor.isWhiteSpace():
				value += self.cursor.consume()
			else:
				break
		return Token(TokenEnum.Token, value)
