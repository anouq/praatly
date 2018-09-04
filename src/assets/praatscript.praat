form Variables
	comment IDs of first and last Sound objects (0 if you want all Sound objects)
	integer Begin 0
	integer End 0

	comment Pitch variables
	positive Interval 0.01
	positive Minimum_pitch_(Hz) 75
	positive Maximum_pitch_(Hz) 400
endform

if begin < 1 | end < 1
	begin = 1
	select all
	end = numberOfSelected()
else
  select all
  if end > numberOfSelected()
  	end = numberOfSelected()
  endif

  if begin > end
    begin = end - 1
  endif
endif

dateTime$ = date$()
day$ = mid$(dateTime$, 9, 2)
month$ = mid$(dateTime$, 5, 3)
year$ = right$(dateTime$, 4)
date$ = year$ + "-" + month$ + "-" + day$
time$ = left$(right$(dateTime$, 13), 5)
dateTime$ = time$ + "_" + date$

results$ = dateTime$ + "_pitch.csv"
writeFileLine: results$, "type,minPitch,meanPitch,maxPitch,sec,n"

sounds# = selected#("Sound")

for i from begin to end
	selectObject: sounds#[i]
	type$ = extractWord$(selected$ (), "Sound ")

	To Pitch... interval minimum_pitch maximum_pitch
	minPitch = Get minimum... 0 0 Hertz None
	meanPitch = Get mean... 0 0 Hertz
  maxPitch = Get maximum... 0 0 Hertz None
  sec = Get total duration
  n = Get number of frames
  Remove

  appendFileLine: results$, "'type$','minPitch','meanPitch','maxPitch','sec','n'"
endfor
