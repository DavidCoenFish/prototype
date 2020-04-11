/*
a tea bagging simulator where you hit people with flaming banjos

oVPI2ESkgIw

2020-03-21
get a first pass of the tutorial levels done for "tea bag army"
	gameplay pass
	visual pass
	ballance pass
	tool pass

misc
	dash

gameplay pass
	pickup pan
	ko
	load ammo
	shoot
	swirl

visual pass
	ui shader
	creature visual

ballance pass


tool pass
	drive2json: add sheet3array
	drive2json: set root by id, metadata on demand

notes:

 body updates camera pos (using prev input)
flush the per frame state
 want camera update before working out ui pick button pos
 want to collect all buttons before process input



 rigidbody.AddRelativeForce( Vector3.up * (rigidbody.mass * Mathf.Abs(Physics.gravity.y) ) );

 */