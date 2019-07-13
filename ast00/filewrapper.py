import os

class FileWrapper:
	def __init__(self, in_relativePath, in_filePath):
		self.relativePath = in_relativePath
		self.filePath = in_filePath

		file = open(in_filePath, 'rt', encoding="utf-8")
		self.contents = file.read()
		file.close()

	def getContents(self):
		return self.contents

	def __str__(self):
		result = f"\n"
		result += f"FileWrapper\n"
		result += f"  relativePath:{self.relativePath}\n"
		result += f"  filePath:{self.filePath}\n"
		return result

		#print(self.textArray)
