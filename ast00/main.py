import sys

import environment
import dast

def main( in_inputDir, in_outputDir, in_translationUnit):
	print("main")

	env = environment.Environment([in_inputDir], in_outputDir)

	translationUnitRootFile = env.resolveFile( in_translationUnit )
	rootDAst = dast.Factory(translationUnitRootFile, env)

	print(rootDAst)

main( sys.argv[1], sys.argv[2], sys.argv[3] )
