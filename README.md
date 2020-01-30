# ffmpeg-crop-tc
Commandline tool to generate ffmpeg lines with optional crop points

# Usage Instruction
tc filename.mp4 00.25-01.10,01.30-02:05 crop 0 4 125 2955 1599 125 50

 	tc, filename, timecodes, crop(or copy), increment_start_number, crf, bitrate(MBPS), width, height, left, top
