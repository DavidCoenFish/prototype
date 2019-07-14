import sys

import environment
import dast

def main():
	print("test")

	env = environment.Environment(["input"], "output")
	translationUnitRootFile = env.resolveFile( "gcamera.h" )
	rootDAst = dast.Factory(translationUnitRootFile, env)

	print(rootDAst)

main()
