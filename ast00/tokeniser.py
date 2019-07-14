# c++ treats comments as whitespace, we don't quite want that
# we could append the comments and insert them before/ after ast nodes?
# otherwise would have to allow comments anywhere....
#lets go with comments everywhere?
import enum

#keywords, identifiers, literals, operators, punctuators
class TokenEnum(enum.Enum):
	Comment = 1
	String = 2
	IntegerLiteral = 3
	FloatLiteral = 4
	Punctuators = 5
	Keyword = 6
	Identifiers = 7
	Operator = 8
	Preprocessor = 9
	BooleanLiteral = 10
	PointerLiteral = 11
	Error = 12

	#SpecialSymbol = 5
	#Operator = 6

s_spaceCharSet = set([" ", "\t", "\n", "\v", "\f", "\r"])
#s_stringCharSet = set(["'", "\""])
s_newlineCharSet = set(["\n", "\r"])
s_lineContinueCharSet = set(["\\"])
s_stringEscapeCharSet = set(["\\"])
s_numericLeadCharacterSet = set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
s_numericHexCharacterSet = set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f"])
s_numericOctalCharacterSet = set(["0", "1", "2", "3", "4", "5", "6", "7"])
s_numericPostPend = set(["u", "U", "l", "L"])
s_punctuatorsSet = set(["!", "%", "^", "&", "*", "(", ")", "-", "+", "=", "{", "}", "|", "~", "[", "]", "\\", ";", "'", ":", "\"", "<", ">", "?", ",", ".", "/", "#"])
s_numericCharacterSet = set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "f", "F", "e", "E"])

s_booleanLiteral = set(["true", "false"])

s_keyWordSet = set([
	#c
	"auto",
	"double",
	"int",
	"struct",
	"break",
	"else",
	"long",
	"switch",
	"case",
	"enum",
	"register",
	"typedef",
	"char",
	"extern",
	"return",
	"union",
	"const",
	"float",
	"short",
	"unsigned",
	"continue",
	"for",
	"signed",
	"void",
	"default",
	"goto",
	"sizeof",
	"volatile",
	"do",
	"if",
	"static",
	"while",
	#c++
	"asm",
	"bool",
	"catch",
	"class",
	"const_cast",
	"delete",
	"dynamic_cast",
	"explicit",
	"export",
	"false",
	"friend",
	"inline",
	"mutable",
	"namespace",
	"new",
	"operator",
	"private",
	"protected",
	"public",
	"reinterpret_cast",
	"static_cast",
	"template",
	"this",
	"throw",
	"true",
	"try",
	"typeid",
	"typename",
	"using",
	"virtual",
	"wchar_t"
	])

s_specialSymbolSet = set(["[", "]", "(", ")", "{", "}", ",", ";", "*", "=", "#"])

s_operatorSet = set([ "::", ".", "->", "[", "]", "(", ")", "++", "--", 
	"typeid",
	"const_cast",
	"dynamic_cast",
	"reinterpret_cast",
	"static_cast",
	"sizeof",
	"~",
	"!",
	"-",
	"+",
	"&",
	"*",
	"new",
	"delete",
	"(",
	")",
	"*",
	"/",
	"%",
	"+",
	"-",
	"<<",
	">>",
	"<",
	">",
	"<=",
	">=",
	"==",
	"!=",
	"&",
	"^",
	"|",
	"&&",
	"||",
	"?",
	":",
	"=",
	"*=",
	"/=",
	"%=",
	"+=",
	"-=",
	"<<=",
	">>=",
	"&=",
	"|=",
	"^=",
	"throw",
	","
	])
s_preprocessorSet = set([
	"#define",
	"#undef",
	"#ifdef",
	"#ifndef",
	"#if",
	"#endif",
	"#else",
	"#elif",
	"#line",
	"#error",
	"#include",
	"#pragma"
])
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
		return self.index < self.length

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
		return False

	def isLineContinue(self):
		if self.index + 1 < self.length:
			charSequence = self.contents[self.index] + self.contents[self.index + 1] + self.contents[self.index + 2]
			return charSequence == "\\\r" or charSequence == "\\\n"
		return False

	def isNewlineWindows(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "\r\n"
		return False

	def isNewline(self):
		char = self.contents[self.index]
		return char in s_newlineCharSet

	def extractPreprocessorOrNone(self):
		longestMatch = 0
		match = None
		for item in s_preprocessorSet:
			length = len(item)
			needle = self.contents[self.index:self.index + length]
			if needle == item and longestMatch < length:
				longestMatch = length
				match = item
		return match

	def extractLongestOperatorOrNone(self):
		longestMatch = 0
		match = None
		for item in s_operatorSet:
			length = len(item)
			needle = self.contents[self.index:self.index + length]
			if needle == item and longestMatch < length:
				longestMatch = length
				match = item
		return match

	def isBigString(self):
		char = self.contents[self.index]
		return char == "\""

	def isLittleString(self):
		char = self.contents[self.index]
		return char == "'"

	def isEndOfLineComment(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "//"
		return False

	def isCommentStart(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "/*"
		return False

	def isCommentEnd(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "*/"
		return False

	def isStringEscape(self):
		char = self.contents[self.index]
		return char in s_stringEscapeCharSet

	def isPunctuators(self):
		char = self.contents[self.index]
		return char in s_punctuatorsSet
	
	def isNumericLeadCharacter(self):
		char = self.contents[self.index]
		return char in s_numericLeadCharacterSet

	def isNotEndOfHex(self):
		char = self.contents[self.index]
		return char in s_numericHexCharacterSet or char in s_numericPostPend

	def isHex(self):
		if self.index + 1 < self.length:
			charPair = self.contents[self.index] + self.contents[self.index + 1]
			return charPair == "0x" or charPair == "0X"
		return False

	def isOctal(self):
		if self.index + 1 < self.length:
			charNext = self.contents[self.index + 1]
			char = self.contents[self.index]
			return char == "0" and charNext in s_numericOctalCharacterSet

	def isNotEndOfOctal(self):
		char = self.contents[self.index]
		return char in s_numericOctalCharacterSet or char in s_numericPostPend
	def isDecimalPoint(self):
		char = self.contents[self.index]
		return char == "."
	def isExponent(self):
		char = self.contents[self.index]
		return char == "e" or char == "E"
	def isNotEndOfNumber(self):
		char = self.contents[self.index]
		return char in s_numericCharacterSet

class Token:
	def __init__(self, in_tokenEnum, in_value, in_line, in_file):
		self.tokenEnum = in_tokenEnum
		self.value = in_value
		self.line = in_line
		self.file = in_file

	def getTokenEnum(self):
		return self.tokenEnum

	def getValue(self):
		return self.value

	def getLine(self):
		return self.line

	def __str__(self):
		result = f"\n"
		result += f"Token\n"
		result += f"  tokenEnum:{self.tokenEnum}\n"
		result += f"  value:{self.value}\n"
		result += f"  line:{self.line}\n"
		result += f"  file:{self.file}\n"
		return result

class Tokeniser:
	def __init__(self, in_contents, in_file):
		self.cursor = Cursor(in_contents, in_file)
		self.line = 1
		self.file = in_file

	def __iter__(self):
		return self

	def __next__(self): # Python 2: def next(self)
		token = self.consumeToken()
		if not token:
			raise StopIteration
		return token

	def consumeToken(self): 
		if not self.cursor.isValid():
			return None

		#advance whitespace
		while self.cursor.isValid():
			if self.cursor.isNewlineWindows():
				self.line += 1
				self.cursor.advance(2)
			elif self.cursor.isNewline():
				self.line += 1
				self.cursor.advance(1)
			elif self.cursor.isWhiteSpace():
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
					self.line += 1
				elif self.cursor.isLineContinue():
					self.cursor.advance(2)
					self.line += 1
				elif self.cursor.isNewlineWindows():
					self.cursor.advance(2)
					self.line += 1
					break
				elif self.cursor.isNewline():
					self.cursor.advance(1)
					self.line += 1
					break
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.Comment, value, self.line, self.file)

		#start end comments
		if self.cursor.isCommentStart():
			value = ""
			self.cursor.advance(2)
			while self.cursor.isValid():
				if self.cursor.isCommentEnd():
					self.cursor.advance(2)
					break
				elif self.cursor.isNewlineWindows():
					value += self.cursor.consume()
					value += self.cursor.consume()
					self.line += 1
				elif self.cursor.isNewline():
					value += self.cursor.consume()
					self.line += 1
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.Comment, value, self.line, self.file)

		#preprocessor
		preprocessor = self.cursor.extractPreprocessorOrNone()
		if preprocessor:
			self.cursor.advance(len(preprocessor))
			return Token(TokenEnum.Preprocessor, preprocessor, self.line, self.file)

		#operator
		operator = self.cursor.extractLongestOperatorOrNone()
		if operator:
			self.cursor.advance(len(operator))
			return Token(TokenEnum.Operator, operator, self.line, self.file)

		#string
		if self.cursor.isBigString():
			value = ""
			self.cursor.advance(1)
			while self.cursor.isValid():
				if self.cursor.isStringEscape():
					value += self.cursor.consume()
					value += self.cursor.consume()
				elif self.cursor.isBigString():
					self.cursor.advance(1)
					break
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.String, value, self.line, self.file)

		#string
		if self.cursor.isLittleString():
			self.cursor.advance(1)
			value = ""
			while self.cursor.isValid():
				if self.cursor.isStringEscape():
					value += self.cursor.consume()
					value += self.cursor.consume()
				elif self.cursor.isLittleString():
					self.cursor.advance(1)
					break
				else:
					value += self.cursor.consume()
			return Token(TokenEnum.String, value, self.line, self.file)

		#numeric
		if self.cursor.isNumericLeadCharacter():
			value = ""
			if self.cursor.isHex():
				self.cursor.advance(2)
				while self.cursor.isNotEndOfHex():
					value += self.cursor.consume()
				return Token(TokenEnum.IntegerLiteral, value, self.line, self.file)
			if self.cursor.isOctal():
				self.cursor.advance(1)
				while self.cursor.isNotEndOfOctal():
					value += self.cursor.consume()
				return Token(TokenEnum.IntegerLiteral, value, self.line, self.file)
			isFloat = False
			while self.cursor.isNotEndOfNumber():
				if self.cursor.isDecimalPoint() or self.cursor.isExponent():
					isFloat = True
				value += self.cursor.consume()
			if isFloat:
				return Token(TokenEnum.FloatLiteral, value, self.line, self.file)
			else:
				return Token(TokenEnum.IntegerLiteral, value, self.line, self.file)

		#punctuators
		if self.cursor.isPunctuators():
			value = self.cursor.consume()
			return Token(TokenEnum.Punctuators, value, self.line, self.file)


		#token
		value = ""
		while self.cursor.isValid():
			if self.cursor.isPunctuators():
				break
			elif not self.cursor.isWhiteSpace():
				value += self.cursor.consume()
			else:
				break
		if value == "nullptr":
			return Token(TokenEnum.PointerLiteral, value, self.line, self.file)
		elif value in s_booleanLiteral:
			return Token(TokenEnum.BooleanLiteral, value, self.line, self.file)
		elif value in s_keyWordSet:
			return Token(TokenEnum.Keyword, value, self.line, self.file)
		else:
			return Token(TokenEnum.Identifiers, value, self.line, self.file)
