::C:\development\prototype\unity\test00\Assets

chdir %~dp0

robocopy Assets C:\development\prototype\unity\test00\Assets /mir
robocopy ProjectSettings C:\development\prototype\unity\test00\ProjectSettings /mir
robocopy Notes C:\development\prototype\unity\test00\Notes /mir
copy robocopy_assets_to_git.cmd C:\development\prototype\unity\test00\robocopy_assets_to_git.cmd

pause