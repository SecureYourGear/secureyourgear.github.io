---
title: "Bandit CTF: Levels 0-17"
author: SecureYourGear Team
date: 2024-10-03 12:00:00 +0800
categories: [CTF, OverTheWire]
tags: [bandit, overthewire, ctf, linux, command-line, ssh, networking, file-manipulation, nmap]
---

![OverTheWire Bandit](/assets/img/otw_intro.jpg)

This is a complete, step-by-step walkthrough of OverTheWire Bandit levels 0-17. Follow along with each command and see exactly what output to expect. Perfect for beginners learning Linux command-line skills.

## What is Bandit?

[OverTheWire Bandit](https://overthewire.org/wargames/bandit/) teaches Linux command-line fundamentals through hands-on challenges. Each level builds on the previous one, introducing new commands and concepts.

---

## Level 0

> **Level Goal**: Log into the game using SSH to the machine bandit.labs.overthewire.org on port 2220.

**Recommended Commands**: `ssh`

**Theory**: SSH (Secure Shell) is a protocol for securely accessing remote computers. The basic syntax is `ssh username@host -p port`.

**Login**:
```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
# Password: bandit0
```

You're now logged into Level 0!

---

## Level 0 → Level 1

> **Level Goal**: The password for the next level is stored in a file called `readme` located in the home directory.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
# Password: bandit0
```

**Commands You'll Need**:
- `ls` - Lists files in the current directory
- `cat` - Displays file contents
- `pwd` - Shows current directory path

**Solution**:

Step 1: Check where you are
```bash
bandit0@bandit:~$ pwd
/home/bandit0
```

Step 2: List files in the directory
```bash
bandit0@bandit:~$ ls
readme
```

Step 3: Read the file
```bash
bandit0@bandit:~$ cat readme
NH2SXQwcBdpmTEzi3bvBHMM9H66vVXjL
```

**Password for Level 1**: `NH2SXQwcBdpmTEzi3bvBHMM9H66vVXjL`

---

## Level 1 → Level 2

> **Level Goal**: The password for the next level is stored in a file called `-` located in the home directory.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit1@bandit.labs.overthewire.org -p 2220
# Password: NH2SXQwcBdpmTEzi3bvBHMM9H66vVXjL
```

**Theory**: The filename `-` is special in Linux - it represents stdin/stdout. To read it as a file, we need to specify the path.

**Solution**:

Step 1: List files
```bash
bandit1@bandit:~$ ls
-
```

Step 2: Try reading it normally (this won't work)
```bash
bandit1@bandit:~$ cat -
# This will hang, waiting for input from stdin
# Press Ctrl+C to cancel
```

Step 3: Read it using the path
```bash
bandit1@bandit:~$ cat ./-
rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi
```

**Alternative methods**:
```bash
# Using absolute path
bandit1@bandit:~$ cat /home/bandit1/-

# Using input redirection
bandit1@bandit:~$ cat < -
```

**Password for Level 2**: `rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi`

---

## Level 2 → Level 3

> **Level Goal**: The password for the next level is stored in a file called `spaces in this filename` located in the home directory.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit2@bandit.labs.overthewire.org -p 2220
# Password: rRGizSaX8Mk1RTb1CNQoXTcYZWU6lgzi
```

**Theory**: Filenames with spaces need special handling. You can either:
- Use quotes around the filename
- Escape each space with a backslash (`\`)
- Use tab completion to auto-escape

**Solution**:

Step 1: List files
```bash
bandit2@bandit:~$ ls
spaces in this filename
```

Step 2: Read using quotes
```bash
bandit2@bandit:~$ cat "spaces in this filename"
aBZ0W5EmUfAf7kHTQeOwd8bauFJ2lAiG
```

**Alternative methods**:
```bash
# Using backslash escaping
bandit2@bandit:~$ cat spaces\ in\ this\ filename

# Using tab completion (type 'cat s' then press Tab)
bandit2@bandit:~$ cat spaces<tab>
```

**Password for Level 3**: `aBZ0W5EmUfAf7kHTQeOwd8bauFJ2lAiG`

---

## Level 3 → Level 4

> **Level Goal**: The password for the next level is stored in a hidden file in the `inhere` directory.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit3@bandit.labs.overthewire.org -p 2220
# Password: aBZ0W5EmUfAf7kHTQeOwd8bauFJ2lAiG
```

**Theory**: Hidden files in Linux start with a dot (`.`). By default, `ls` doesn't show them. Use `ls -a` to see all files, including hidden ones.

**Solution**:

Step 1: Navigate to the directory
```bash
bandit3@bandit:~$ cd inhere
```

Step 2: Try listing files normally
```bash
bandit3@bandit:~/inhere$ ls
# No output - files are hidden
```

Step 3: List ALL files including hidden ones
```bash
bandit3@bandit:~/inhere$ ls -a
.  ..  .hidden
```

Step 4: Read the hidden file
```bash
bandit3@bandit:~/inhere$ cat .hidden
2EW7BBsr6aMMoJ2HjW067dm8EgX26xNe
```

**Useful flags**:
- `ls -a` - Show all files (including hidden)
- `ls -l` - Long format with details
- `ls -la` - Combination of both

**Password for Level 4**: `2EW7BBsr6aMMoJ2HjW067dm8EgX26xNe`

---

## Level 4 → Level 5

> **Level Goal**: The password for the next level is stored in the only human-readable file in the `inhere` directory.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit4@bandit.labs.overthewire.org -p 2220
# Password: 2EW7BBsr6aMMoJ2HjW067dm8EgX26xNe
```

**Theory**: The `file` command identifies file types. Not all files are human-readable text - some are binary data.

**Solution**:

Step 1: Navigate and list files
```bash
bandit4@bandit:~$ cd inhere
bandit4@bandit:~/inhere$ ls
-file00  -file01  -file02  -file03  -file04  -file05  -file06  -file07  -file08  -file09
```

Step 2: Check file types
```bash
bandit4@bandit:~/inhere$ file ./*
./-file00: data
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
```

Step 3: Read the ASCII text file
```bash
bandit4@bandit:~/inhere$ cat ./-file07
lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR
```

**Tip**: The `*` wildcard means "all files" - `file ./*` checks all files in the current directory.

**Password for Level 5**: `lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR`

---

## Level 5 → Level 6

> **Level Goal**: The password for the next level is stored in a file somewhere under the `inhere` directory and has all of the following properties: human-readable, 1033 bytes in size, and not executable.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`

**Login**:
```bash
ssh bandit5@bandit.labs.overthewire.org -p 2220
# Password: lrIWWI6bB37kxfiCQZqUdOIYfr6eEeqR
```

**Theory**: The `find` command searches for files based on criteria like size, permissions, and type.

**Solution**:

Step 1: Navigate to the directory
```bash
bandit5@bandit:~$ cd inhere
bandit5@bandit:~/inhere$ ls
maybehere00  maybehere02  maybehere04  maybehere06  maybehere08  maybehere10  maybehere12  maybehere14  maybehere16  maybehere18
maybehere01  maybehere03  maybehere05  maybehere07  maybehere09  maybehere11  maybehere13  maybehere15  maybehere17  maybehere19
```

Step 2: Use find with multiple criteria
```bash
bandit5@bandit:~/inhere$ find . -type f -size 1033c ! -executable
./maybehere07/.file2
```

Let's break down this command:
- `.` - Search in current directory
- `-type f` - Find files (not directories)
- `-size 1033c` - Exactly 1033 bytes (c = bytes)
- `! -executable` - NOT executable

Step 3: Read the file
```bash
bandit5@bandit:~/inhere$ cat ./maybehere07/.file2
P4L4vucdmLnm8I7Vl7jG1ApGSfjYKqJU
```

**Password for Level 6**: `P4L4vucdmLnm8I7Vl7jG1ApGSfjYKqJU`

---

## Level 6 → Level 7

> **Level Goal**: The password for the next level is stored somewhere on the server and has all of the following properties: owned by user bandit7, owned by group bandit6, and 33 bytes in size.

**Recommended Commands**: `ls`, `cd`, `cat`, `file`, `du`, `find`, `grep`

**Login**:
```bash
ssh bandit6@bandit.labs.overthewire.org -p 2220
# Password: P4L4vucdmLnm8I7Vl7jG1ApGSfjYKqJU
```

**Theory**: Searching the entire server generates permission errors. We redirect errors to `/dev/null` to hide them.

**Solution**:

Step 1: Search the entire server
```bash
bandit6@bandit:~$ find / -user bandit7 -group bandit6 -size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password
```

Command breakdown:
- `/` - Search from root directory (entire server)
- `-user bandit7` - Owned by bandit7
- `-group bandit6` - Owned by group bandit6
- `-size 33c` - Exactly 33 bytes
- `2>/dev/null` - Redirect errors to nowhere (hide "Permission denied" messages)

Step 2: Read the file
```bash
bandit6@bandit:~$ cat /var/lib/dpkg/info/bandit7.password
z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S
```

**Password for Level 7**: `z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S`

---

## Level 7 → Level 8

> **Level Goal**: The password for the next level is stored in the file `data.txt` next to the word "millionth".

**Recommended Commands**: `man`, `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`

**Login**:
```bash
ssh bandit7@bandit.labs.overthewire.org -p 2220
# Password: z7WtoNQU2XfjmMtWA8u5rN4vzqu4v99S
```

**Theory**: `grep` searches for patterns in files. It's perfect for finding specific words in large text files.

**Solution**:

Step 1: Check the file (it's large!)
```bash
bandit7@bandit:~$ wc -l data.txt
98567 data.txt
```

Step 2: Search for "millionth"
```bash
bandit7@bandit:~$ grep "millionth" data.txt
millionth       TESKZC0XvTetK0S9xNwm25STk5iWrBvP
```

The password is the second column after "millionth".

**Password for Level 8**: `TESKZC0XvTetK0S9xNwm25STk5iWrBvP`

---

## Level 8 → Level 9

> **Level Goal**: The password for the next level is stored in the file `data.txt` and is the only line of text that occurs only once.

**Recommended Commands**: `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`

**Login**:
```bash
ssh bandit8@bandit.labs.overthewire.org -p 2220
# Password: TESKZC0XvTetK0S9xNwm25STk5iWrBvP
```

**Theory**:
- `sort` - Arranges lines alphabetically
- `uniq -u` - Shows only unique lines (lines that appear once)
- Pipe (`|`) - Passes output from one command to another

**Solution**:

Step 1: Sort then find unique lines
```bash
bandit8@bandit:~$ sort data.txt | uniq -u
EN632PlfYiZbn3PhVK3XOGSlNInNE00t
```

Why we need `sort` first: `uniq` only compares adjacent lines, so we must sort the file first to group duplicate lines together.

**Password for Level 9**: `EN632PlfYiZbn3PhVK3XOGSlNInNE00t`

---

## Level 9 → Level 10

> **Level Goal**: The password for the next level is stored in the file `data.txt` in one of the few human-readable strings, preceded by several '=' characters.

**Recommended Commands**: `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`

**Login**:
```bash
ssh bandit9@bandit.labs.overthewire.org -p 2220
# Password: EN632PlfYiZbn3PhVK3XOGSlNInNE00t
```

**Theory**: `strings` extracts printable text from binary files. Binary files contain non-text data that would look like gibberish if you tried to `cat` them.

**Solution**:

Step 1: Extract readable strings and search for `=`
```bash
bandit9@bandit:~$ strings data.txt | grep "===="
========== the*2i"4
========== password
Z)========== is
&========== G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s
```

The password is in the last line.

**Password for Level 10**: `G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s`

---

## Level 10 → Level 11

> **Level Goal**: The password for the next level is stored in the file `data.txt`, which contains base64 encoded data.

**Recommended Commands**: `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`

**Login**:
```bash
ssh bandit10@bandit.labs.overthewire.org -p 2220
# Password: G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s
```

**Theory**: Base64 is an encoding scheme that represents binary data in ASCII text. It's commonly used for transmitting data over text-based protocols.

**Solution**:

Step 1: Look at the encoded data
```bash
bandit10@bandit:~$ cat data.txt
VGhlIHBhc3N3b3JkIGlzIDZ6UGV6aUxkUjJSS05kTllGTmI2blZDS3pwaGxYSEJN
```

Step 2: Decode it
```bash
bandit10@bandit:~$ base64 -d data.txt
The password is 6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM
```

The `-d` flag means "decode".

**Password for Level 11**: `6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM`

---

## Level 11 → Level 12

> **Level Goal**: The password for the next level is stored in the file `data.txt`, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions (ROT13).

**Recommended Commands**: `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`

**Login**:
```bash
ssh bandit11@bandit.labs.overthewire.org -p 2220
# Password: 6zPeziLdR2RKNdNYFNb6nVCKzphlXHBM
```

**Theory**: ROT13 rotates each letter 13 positions in the alphabet. It's symmetric - applying ROT13 twice gives you the original text. The `tr` (translate) command substitutes characters.

**Solution**:

Step 1: Look at the encoded text
```bash
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 5Gr8L4qetPEsPk8htqjhRK8XSP6x2RHh
```

Step 2: Decode with ROT13
```bash
bandit11@bandit:~$ cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
The password is 5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu
```

Command breakdown:
- `tr 'A-Za-z' 'N-ZA-Mn-za-m'` - Translates characters
- `A-Za-z` - All letters (uppercase and lowercase)
- `N-ZA-Mn-za-m` - Each letter shifted 13 positions

**Password for Level 12**: `5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu`

---

## Level 12 → Level 13

> **Level Goal**: The password for the next level is stored in the file `data.txt`, which is a hexdump of a file that has been repeatedly compressed.

**Recommended Commands**: `grep`, `sort`, `uniq`, `strings`, `base64`, `tr`, `tar`, `gzip`, `bzip2`, `xxd`, `mkdir`, `cp`, `mv`, `file`

**Login**:
```bash
ssh bandit12@bandit.labs.overthewire.org -p 2220
# Password: 5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu
```

**Theory**: This file has been compressed multiple times using different compression tools (gzip, bzip2, tar). We need to:
1. Convert hexdump back to binary
2. Identify compression type
3. Decompress
4. Repeat until we get the password

**Solution**:

Step 1: Create a workspace (can't write in home directory)
```bash
bandit12@bandit:~$ mkdir /tmp/mywork12
bandit12@bandit:~$ cd /tmp/mywork12
bandit12@bandit:/tmp/mywork12$ cp ~/data.txt .
```

Step 2: Convert hexdump to binary
```bash
bandit12@bandit:/tmp/mywork12$ xxd -r data.txt > data.bin
```

Step 3: Check what type of file it is
```bash
bandit12@bandit:/tmp/mywork12$ file data.bin
data.bin: gzip compressed data
```

Step 4: Decompress (gzip)
```bash
bandit12@bandit:/tmp/mywork12$ mv data.bin data.gz
bandit12@bandit:/tmp/mywork12$ gunzip data.gz
```

Step 5: Check file type again
```bash
bandit12@bandit:/tmp/mywork12$ file data
data: bzip2 compressed data
```

Step 6: Decompress (bzip2)
```bash
bandit12@bandit:/tmp/mywork12$ bunzip2 data
bunzip2: Can't guess original name for data -- using data.out
bandit12@bandit:/tmp/mywork12$ file data.out
data.out: gzip compressed data
```

Step 7: Decompress (gzip again)
```bash
bandit12@bandit:/tmp/mywork12$ mv data.out data.gz
bandit12@bandit:/tmp/mywork12$ gunzip data.gz
```

Step 8: Check file type
```bash
bandit12@bandit:/tmp/mywork12$ file data
data: POSIX tar archive
```

Step 9: Extract tar archive
```bash
bandit12@bandit:/tmp/mywork12$ tar -xf data
bandit12@bandit:/tmp/mywork12$ ls
data  data5.bin  data.txt
```

Step 10: Continue checking and extracting
```bash
bandit12@bandit:/tmp/mywork12$ file data5.bin
data5.bin: POSIX tar archive
bandit12@bandit:/tmp/mywork12$ tar -xf data5.bin
bandit12@bandit:/tmp/mywork12$ ls
data  data5.bin  data6.bin  data.txt
```

Step 11: More decompression
```bash
bandit12@bandit:/tmp/mywork12$ file data6.bin
data6.bin: bzip2 compressed data
bandit12@bandit:/tmp/mywork12$ bunzip2 data6.bin
bunzip2: Can't guess original name for data6.bin -- using data6.bin.out
```

Step 12: Continue...
```bash
bandit12@bandit:/tmp/mywork12$ file data6.bin.out
data6.bin.out: POSIX tar archive
bandit12@bandit:/tmp/mywork12$ tar -xf data6.bin.out
bandit12@bandit:/tmp/mywork12$ ls
data  data5.bin  data6.bin.out  data8.bin  data.txt
```

Step 13: Final decompression
```bash
bandit12@bandit:/tmp/mywork12$ file data8.bin
data8.bin: gzip compressed data
bandit12@bandit:/tmp/mywork12$ mv data8.bin data8.gz
bandit12@bandit:/tmp/mywork12$ gunzip data8.gz
```

Step 14: Read the password!
```bash
bandit12@bandit:/tmp/mywork12$ file data8
data8: ASCII text
bandit12@bandit:/tmp/mywork12$ cat data8
The password is wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw
```

**Key commands**:
- `xxd -r` - Reverse hexdump
- `file` - Identify file type (use after each decompression!)
- `gunzip` - Decompress .gz files
- `bunzip2` - Decompress .bz2 files
- `tar -xf` - Extract tar archives

**Password for Level 13**: `wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw`

---

## Level 13 → Level 14

> **Level Goal**: The password for the next level is stored in `/etc/bandit_pass/bandit14` and can only be read by user bandit14. For this level, you don't get the next password, but you get a private SSH key that can be used to log into the next level.

**Recommended Commands**: `ssh`, `telnet`, `nc`, `openssl`, `s_client`, `nmap`

**Login**:
```bash
ssh bandit13@bandit.labs.overthewire.org -p 2220
# Password: wbWdlBxEir4CaE8LaPhauuOo6pwRmrDw
```

**Theory**: SSH keys provide authentication without passwords. The `-i` flag specifies which private key file to use.

**Solution**:

Step 1: Check what files are available
```bash
bandit13@bandit:~$ ls
sshkey.private
```

Step 2: Use the SSH key to connect to bandit14 on localhost
```bash
bandit13@bandit:~$ ssh -i sshkey.private bandit14@localhost -p 2220
```

You should now be logged in as bandit14!

Step 3: Read the password file
```bash
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq
```

**Security Note**: Never expose private SSH keys in public repositories or share them. They provide direct access to systems.

**Password for Level 14**: `fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq`

---

## Level 14 → Level 15

> **Level Goal**: The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

**Recommended Commands**: `ssh`, `telnet`, `nc`, `openssl`, `s_client`, `nmap`

**Login**:
```bash
ssh bandit14@bandit.labs.overthewire.org -p 2220
# Password: fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq
```

**Theory**: Netcat (`nc`) is the "Swiss Army knife" of networking. It can make TCP/UDP connections, listen on ports, and transfer data.

**Solution**:

Step 1: Connect to port 30000 and send the password
```bash
bandit14@bandit:~$ echo "fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq" | nc localhost 30000
Correct!
jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt
```

**Alternative method** (interactive):
```bash
bandit14@bandit:~$ nc localhost 30000
fGrHPx402xGC7U7rXKDaxiWFTOiF0ENq
Correct!
jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt
```

**Password for Level 15**: `jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt`

---

## Level 15 → Level 16

> **Level Goal**: The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

**Recommended Commands**: `ssh`, `telnet`, `nc`, `openssl`, `s_client`, `nmap`

**Login**:
```bash
ssh bandit15@bandit.labs.overthewire.org -p 2220
# Password: jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt
```

**Theory**: SSL/TLS encrypts network traffic. OpenSSL's `s_client` command creates SSL/TLS connections.

**Solution**:

Step 1: Connect with SSL and send the password
```bash
bandit15@bandit:~$ echo "jN2kgmIXJ6fShzhT2avhotn4Zcka6tnt" | openssl s_client -connect localhost:30001 -quiet
depth=0 CN = localhost
verify error:num=18:self signed certificate
verify return:1
depth=0 CN = localhost
verify return:1
Correct!
JQttfApK4SeyHwDlI9SXGR50qclOAil1
```

The `-quiet` flag suppresses certificate information. You can ignore the "self signed certificate" warnings.

**Password for Level 16**: `JQttfApK4SeyHwDlI9SXGR50qclOAil1`

---

## Level 16 → Level 17

> **Level Goal**: The credentials for the next level can be retrieved by submitting the password of the current level to a port on localhost in the range 31000 to 32000. First find out which of these ports have a server listening on them. Then find out which of those speak SSL and which don't. There is only 1 server that will give you the next credentials, the others will simply send back what you send to it.

**Recommended Commands**: `ssh`, `telnet`, `nc`, `openssl`, `s_client`, `nmap`

**Login**:
```bash
ssh bandit16@bandit.labs.overthewire.org -p 2220
# Password: JQttfApK4SeyHwDlI9SXGR50qclOAil1
```

**Theory**: Nmap scans networks to discover open ports and services. We'll use it to find SSL services.

**Solution**:

Step 1: Scan the port range for open ports
```bash
bandit16@bandit:~$ nmap -p 31000-32000 localhost

Starting Nmap 7.40 ( https://nmap.org ) at 2024-10-15 12:00 CEST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00031s latency).
Not shown: 996 closed ports
PORT      STATE SERVICE
31046/tcp open  unknown
31518/tcp open  unknown
31691/tcp open  unknown
31790/tcp open  unknown
31960/tcp open  unknown
```

Step 2: Test each port with SSL (most will just echo back)
```bash
bandit16@bandit:~$ echo "JQttfApK4SeyHwDlI9SXGR50qclOAil1" | openssl s_client -connect localhost:31790 -quiet
depth=0 CN = localhost
verify error:num=18:self signed certificate
verify return:1
depth=0 CN = localhost
verify return:1
Correct!
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAvmOkuifmMg6HL2YPIOjon6iWfbp7c3jx34YkYWqUH57SUdyJ
imZzeyGC0gtZPGujUSxiJSWI/oTqexh+cAMTSMlOJf7+BrJObArnxd9Y7YT2bRPQ
Ja6Lzb558YW3FZl87ORiO+rW4LCDCNd2lUvLE/GL2GWyuKN0K5iCd5TbtJzEkQTu
DSt2mcNn4rhAL+JFr56o4T6z8WWAW18BR6yGrMq7Q/kALHYW3OekePQAzL0VUYbW
JGTi65CxbCnzc/w4+mqQyvmzpWtMAzJTzAzQxNbkR2MBGySxDLrjg0LWN6sK7wNX
x0YVztz/zbIkPjfkU1jHS+9EbVNj+D1XFOJuaQIDAQABAoIBABagpxpM1aoLWfvD
KHcj10nqcoBc4oE11aFYQwik7xfW+24pRNuDE6SFthOar69jp5RlLwD1NhPx3iBl
J9nOM8OJ0VToum43UOS8YxF8WwhXriYGnc1sskbwpXOUDc9uX4+UESzH22P29ovd
d8WErY0gPxun8pbJLmxkAtWNhpMvfe0050vk9TL5wqbu9AlbssgTcCXkMQnPw9nC
YNN6DDP2lbcBrvgT9YCNL6C+ZKufD52yOQ9qOkwFTEQpjtF4uNtJom+asvlpmS8A
vLY9r60wYSvmZhNqBUrj7lyCtXMIu1kkd4w7F77k+DjHoAXyxcUp1DGL51sOmama
+TOWWgECgYEA8JtPxP0GRJ+IQkX262jM3dEIkza8ky5moIwUqYdsx0NxHgRRhORT
8c8hAuRBb2G82so8vUHk/fur85OEfc9TncnCY2crpoqsghifKLxrLgtT+qDpfZnx
SatLdt8GfQ85yA7hnWWJ2MxF3NaeSDm75Lsm+tBbAiyc9P2jGRNtMSkCgYEAypHd
HCctNi/FwjulhttFx/rHYKhLidZDFYeiE/v45bN4yFm8x7R/b0iE7KaszX+Exdvt
SghaTdcG0Knyw1bpJVyusavPzpaJMjdJ6tcFhVAbAjm7enCIvGCSx+X3l5SiWg0A
R57hJglezIiVjv3aGwHwvlZvtszK6zV6oXFAu0ECgYAbjo46T4hyP5tJi93V5HDi
Ttiek7xRVxUl+iU7rWkGAXFpMLFteQEsRr7PJ/lemmEY5eTDAFMLy9FL2m9oQWCg
R8VdwSk8r9FGLS+9aKcV5PI/WEKlwgXinB3OhYimtiG2Cg5JCqIZFHxD6MjEGOiu
L8ktHMPvodBwNsSBULpG0QKBgBAplTfC1HOnWiMGOU3KPwYWt0O6CdTkmJOmL8Ni
blh9elyZ9FsGxsgtRBXRsqXuz7wtsQAgLHxbdLq/ZJQ7YfzOKU4ZxEnabvXnvWkU
YOdjHdSOoKvDQNWu6ucyLRAWFuISeXw9a/9p7ftpxm0TSgyvmfLF2MIAEwyzRqaM
77pBAoGAMmjmIJdjp+Ez8duyn3ieo36yrttF5NSsJLAbxFpdlc1gvtGCWW+9Cq0b
dxviW8+TFVEBl1O4f7HVm6EpTscdDxU+bCXWkfjuRb7Dy9GOtt9JPsX8MBTakzh3
vBgsyi/sN3RqRBcGU40fOoZyfAMT8s1m/uYv52O6IgeuZ/ujbjY=
-----END RSA PRIVATE KEY-----
```

Success! Port 31790 gave us an RSA private key instead of echoing back.

Step 3: Save the private key
```bash
bandit16@bandit:~$ mkdir /tmp/mykey17
bandit16@bandit:~$ cd /tmp/mykey17
bandit16@bandit:/tmp/mykey17$ nano sshkey.private
# Paste the RSA private key
# Save with Ctrl+X, Y, Enter
```

Step 4: Set correct permissions
```bash
bandit16@bandit:/tmp/mykey17$ chmod 600 sshkey.private
```

Step 5: Use the key to connect to bandit17
```bash
bandit16@bandit:/tmp/mykey17$ ssh -i sshkey.private bandit17@localhost -p 2220
```

You're now logged in as bandit17!

---

## Level 17 → Level 18

> **Level Goal**: There are 2 files in the homedirectory: `passwords.old` and `passwords.new`. The password for the next level is in `passwords.new` and is the only line that has been changed between `passwords.old` and `passwords.new`.

**Recommended Commands**: `cat`, `grep`, `ls`, `diff`

**Login**:
```bash
ssh bandit17@bandit.labs.overthewire.org -p 2220
# Use the private key from the previous level
```

**Theory**: The `diff` command compares files line by line and shows differences.

**Solution**:

Step 1: Compare the files
```bash
bandit17@bandit:~$ diff passwords.old passwords.new
42c42
< glZreTEH1V3cGKL6g4conYqZqaEj0mte
---
> hga5tuuCLF6fFzUpnagiMN8ssu9LFrdg
```

The output shows:
- `<` indicates lines from the first file (passwords.old)
- `>` indicates lines from the second file (passwords.new)
- The new password is the line with `>`

**Password for Level 18**: `hga5tuuCLF6fFzUpnagiMN8ssu9LFrdg`

---

## Continue Your Journey

You've completed levels 0-17! Continue to [Bandit CTF: Levels 18-33](/posts/Bandit-CTF-Levels-18-33/) for advanced challenges including:
- Shell escape techniques
- Privilege escalation with SetUID
- Cron jobs and automation
- Git repository analysis
- And much more!

## Commands Learned

| Command | Purpose |
|---------|---------|
| `ls` | List files |
| `cat` | Display file contents |
| `file` | Identify file type |
| `find` | Search for files |
| `grep` | Search text patterns |
| `sort` | Sort lines |
| `uniq` | Find unique lines |
| `strings` | Extract text from binary |
| `base64` | Encode/decode base64 |
| `tr` | Translate characters |
| `xxd` | Hexdump operations |
| `gunzip` | Decompress gzip |
| `bunzip2` | Decompress bzip2 |
| `tar` | Archive operations |
| `nc` | Netcat networking |
| `openssl` | SSL/TLS operations |
| `nmap` | Port scanning |
| `diff` | Compare files |

