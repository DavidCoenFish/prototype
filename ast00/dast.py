import enum
import tokeniser
import semantics

class DAstEnum(enum.Enum):
	TranslationUnit = 1
	Comment = 2
	PreprocessorInclude = 3
	PreprocessorDefine = 4
	PreprocessorIf = 5
	PreprocessorIfndef = 6
	PreprocessorIfdef = 7
	PreprocessorElse = 8
	PreprocessorElif = 9
	PreprocessorEndif = 10

def Factory( in_fileWrapper, in_environment ):
	childArray = []
	if in_fileWrapper:
		fileTokeniser = tokeniser.Tokeniser( in_fileWrapper.getContents(), in_fileWrapper.getRelativePath() ); 
		arrayToken = list(fileTokeniser)
		semantics.convertTokenArrayToDAst(childArray, arrayToken, in_fileWrapper, in_environment)
	return DAst(DAstEnum.TranslationUnit, in_fileWrapper, childArray)

class DAst:
	def __init__(self, in_astEnum, in_value = None, childArray = None, commentArray = None):
		self.astEnum = in_astEnum
		self.value = in_value
		self.childArray = childArray
		self.commentArray = commentArray
	def getAstEnum(self):
		return self.astEnum
	def __str__(self):
		result = f"\n"
		result += f"DAst\n"
		result += f"  astEnum:{self.astEnum}\n"
		if self.value:
			result += f"  value:{self.value}\n"
		if self.childArray:
			childResultString = ""
			for item in self.childArray:
				childResultString += str(item)
			result += f"  childArray:[{childResultString}]\n"
		if self.commentArray:
			childResultString = ""
			for item in self.commentArray:
				childResultString += str(item)
			result += f"  commentArray:{childResultString}\n"

		return result
