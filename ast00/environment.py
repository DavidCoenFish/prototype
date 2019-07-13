import os
import os.path
import filewrapper

class Environment:
	def __init__(self, in_inputDirArray, in_outputDir):
		self.inputDirArray = in_inputDirArray
		self.outputDir = in_outputDir
		self.cwd = os.getcwd()

	def getOutputRootDir(self):
		return os.path.join( self.cwd, self.outputDir )

	def resolveFile(self, in_relativeFilePath, in_parentFilePathOrNone = None):
		if in_parentFilePathOrNone:
			newPath = os.path.join( self.cwd, os.path.dirname( in_parentFilePathOrNone ), in_relativeFilePath )
			if os.path.isfile( newPath ):
				return filewrapper.FileWrapper( in_relativeFilePath, newPath )
		for item in self.inputDirArray:
			newPath = os.path.join( self.cwd, item, in_relativeFilePath )
			if os.path.isfile( newPath ):
				return filewrapper.FileWrapper( in_relativeFilePath, newPath )
		print( "ERROR: could not resolve file path:" + in_relativeFilePath )
		print( "cwd:" + self.cwd )
		for item in self.inputDirArray:
			print( "  " + item )