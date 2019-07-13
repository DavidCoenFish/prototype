import enum

class DAstEnum(enum.Enum):
	TranslationUnit = 1
	Comment = 2
	Include = 3

def Factory( in_fileWrapper, in_environment ):
	childArray = []
	
	return DAst(DAstEnum.TranslationUnit, in_fileWrapper, childArray)

class DAst:
	def __init__(self, in_astEnum, in_fileWrapper, childArray):
		self.astEnum = in_astEnum
		self.fileWrapper = in_fileWrapper
	def __str__(self):
		result = f"\n"
		result += f"DAst\n"
		result += f"  astEnum:{self.astEnum}\n"
		result += f"  fileWrapper:{self.fileWrapper}\n"
		result += f"  childArray:[{self.childArray}]\n"
		return result
