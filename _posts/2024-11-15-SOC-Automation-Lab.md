---
title: "SOC Automation Lab: Wazuh, TheHive, and Shuffle"
author: SecureYourGear Team
date: 2024-11-15 12:00:00 +0800
categories: [Blue Team, SOC]
tags: [soc, automation, wazuh, thehive, shuffle, soar, siem, security-operations]
---

![SOC Automation Lab](/assets/img/soc_automation/cyberlab1.jpg)

Learn how to build a production-grade Security Operations Center (SOC) automation lab using Wazuh SIEM, TheHive case management, and Shuffle SOAR. This comprehensive guide walks you through creating an end-to-end security monitoring and incident response platform.

---

## What is a Security Operations Center (SOC)?

Security Operations Centers (SOC) are centralized units that monitor, prevent, detect, investigate, and respond to cyber threats on a 24/7 basis. A modern SOC combines people, processes, and technology to protect an organization's digital assets.

### Common SOC Roles

- **SOC Manager**: Oversees operations and strategic planning
- **SOC Analyst** (Tiers 1-3): Monitors alerts and investigates incidents
- **SOC Engineers**: Builds and maintains security tools
- **Incident Responders**: Handles active security breaches
- **Threat Hunters**: Proactively searches for hidden threats
- **Forensic Analysts**: Investigates security incidents post-breach
- **Threat Intelligence Analysts**: Analyzes emerging threats

### Typical SOC Components

| Component | Purpose |
|-----------|---------|
| **SIEM** | Security Information and Event Management |
| **XDR** | Extended Detection and Response |
| **SOAR** | Security Orchestration, Automation and Response |
| **IDS/IPS** | Intrusion Detection/Prevention Systems |
| **Firewalls** | Network traffic filtering |
| **Vulnerability Scanners** | Identify security weaknesses |
| **Ticketing System** | Case management |
| **Threat Intelligence** | External threat data feeds |

---

## Lab Architecture Overview

In this lab, we'll build a complete SOC automation environment using:

- **Wazuh**: SIEM and XDR platform
- **TheHive**: Incident response and case management
- **Shuffle**: SOAR (Security Orchestration, Automation and Response)
- **VirusTotal**: Threat intelligence enrichment
- **Mimikatz**: Simulated threat for testing

![Lab Topology](/assets/img/soc_automation/soc_3.png)

### Telemetry Flow

Telemetry refers to the automated collection and transmission of data from remote sources. In our lab:

1. **Sensors** (Wazuh Agent) collect security event data from endpoints
2. **Data transmission** occurs over secure channels to the Wazuh Manager
3. **Processing** and analysis happen at the SIEM layer
4. **Presentation** of findings through dashboards and alerts
5. **Automation** via Shuffle workflows
6. **Case management** in TheHive for incident tracking

---

## Part 1: Windows Agent Setup with Sysmon

###  Windows 10 Virtual Machine

We'll use VMware Workstation Pro 17 to host our Windows 10 agent. VMware has approximately 33% market share and provides excellent features for security labs.

**VM Specifications:**
- **OS**: Windows 10 (any edition)
- **Storage**: 128 GB
- **RAM**: 4 GB
- **Processors**: 1

![Windows VM Configuration](/assets/img/soc_automation/soc_4.png)

### Installing Sysmon for Enhanced Logging

**Sysmon** (System Monitor) is a Windows system service from Microsoft Sysinternals that monitors and logs system activity, providing detailed telemetry for security analysis.

**Sysmon Monitoring Capabilities:**
- Process creation and termination
- Network connections
- File creation, deletion, and modification
- Driver and DLL loading
- Raw disk access events
- Registry modifications
- Image loads
- Pipe events
- WMI events

**Installation Steps:**

1. Download Sysmon from [Microsoft Sysinternals](https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon)
2. Download a Sysmon configuration file (sysmonconfig.xml)
3. Open PowerShell as Administrator
4. Install Sysmon with configuration:

```powershell
.\Sysmon64.exe -accepteula -i sysmonconfig.xml
```

5. Verify Sysmon is running:

```powershell
Get-Service Sysmon64
```

![Sysmon Verification](/assets/img/soc_automation/soc_7.png)

The service should show as "Running". You now have a fully functional Windows VM with enhanced logging capabilities.

![Sysmon Service Status](/assets/img/soc_automation/soc_6.png)

### Installing VMware Tools

VMware Tools adds critical functionalities:
- Time synchronization with the host
- Automated script execution
- Secure communication between VM and host
- Optimized drivers for better performance
- Seamless mouse and keyboard integration

**Installation:**
1. VM Menu → Install VMware Tools
2. Open File Explorer → D: drive
3. Run `setup64.exe`
4. Follow the installation wizard

---

## Part 2: Cloud Infrastructure with Digital Ocean

### Understanding Wazuh Components

**Wazuh** is an open-source security platform with four main components:

1. **Wazuh Agent**: Installed on endpoints to collect security data
2. **Wazuh Manager/Server**: Receives and processes data from agents
3. **Wazuh Indexer**: Search engine that stores alerts (based on Elasticsearch)
4. **Wazuh Dashboard**: Web interface for visualization and analysis

### Understanding TheHive Components

**TheHive** is a scalable incident response platform consisting of:

1. **TheHive Server**: Core platform for case management
2. **Cortex**: Analysis engine that runs observables through analyzers
3. **MISP Integration**: Malware Information Sharing Platform for threat intelligence

**Integration Workflow:**

```
MISP → Threat Indicators (IoCs, TTPs) → TheHive
     ↓
VirusTotal → Malware/URL Analysis → Cortex → TheHive
     ↓
Observables (IPs, Hashes) → Analysis Results → Case Evidence
```

![TheHive Architecture](/assets/img/soc_automation/soc_9.png)

### Setting Up Digital Ocean Droplets

**Digital Ocean** provides a straightforward cloud platform for deploying and managing applications. We'll create two droplets (cloud VMs): one for Wazuh and one for TheHive.

**Droplet Configuration:**

- **Location**: Choose your preferred datacenter
- **Operating System**: Ubuntu 22.04 LTS (Long-Term Support)
- **Resources**: 8 GB RAM minimum (for each droplet)
- **Authentication**: SSH key (recommended) or password
- **Firewall**: Configure to allow only your public IP address

![Digital Ocean Droplet Creation](/assets/img/soc_automation/soc_8.png)

**What is a Droplet?**
A droplet is a scalable virtual machine that runs on virtualized hardware, functioning as an independent server for hosting applications, databases, or services.

### Configuring the Firewall

A **firewall** monitors and controls network traffic based on predetermined security rules, acting as a barrier between trusted internal networks and untrusted external networks.

Think of it like a security guard at a building entrance—unauthorized visitors are stopped before they can proceed further.

**Firewall Functions:**
- **Packet Filtering**: Examines individual packets
- **Stateful Inspection**: Tracks connection states
- **Proxy Services**: Acts as intermediary for requests

![Firewall Configuration](/assets/img/soc_automation/soc_10.png)

**Important**: Add your ISP-issued public IP address to the firewall whitelist to allow SSH connections.

---

## Part 3: TheHive Installation and Configuration

### Quick Installation Script

Instead of running commands one by one, create an installation script:

1. SSH into your TheHive droplet
2. Navigate to `/etc` directory
3. Create a script file:

```bash
sudo nano install-thehive.sh
```

4. Add all installation commands
5. Save with `Ctrl + O`, exit with `Ctrl + X`
6. Make executable:

```bash
chmod +x install-thehive.sh
```

7. Run the script:

```bash
./install-thehive.sh
```

![Installation Script](/assets/img/soc_automation/soc_11.png)

**Note**: If you encounter "Daemons using outdated libraries" prompt, press Enter on `dbus.service`.

### Understanding Dependencies

**Dependencies** are external components, libraries, or modules that software requires to function correctly.

**Examples:**
- Website → Animation library for visual effects
- Game → Sound library for audio playback
- Security platform → Database for data storage

**TheHive Dependencies:**
- **Java**: Runtime environment
- **Apache Cassandra**: Primary database
- **Elasticsearch**: Search and indexing engine
- **Utilities**: git, curl, wget, pip

### Configuring Apache Cassandra

**Cassandra** is TheHive's primary database, storing:
- Alert data
- Incident records
- Log data
- Threat intelligence
- User activity data
- Configuration settings
- Vulnerability data

**Configuration Steps:**

1. Edit the Cassandra configuration:

```bash
sudo nano /etc/cassandra/cassandra.yaml
```

2. Modify these settings:

```yaml
listen_address: <TheHive_Public_IP>
rpc_address: <TheHive_Public_IP>
seeds: "<TheHive_Public_IP>"
cluster_name: 'TheHive_Cluster'
```

![Cassandra Configuration](/assets/img/soc_automation/soc_12.png)

3. Restart and verify the service:

```bash
sudo systemctl restart cassandra
sudo systemctl status cassandra
```

![Cassandra Status](/assets/img/soc_automation/soc_13.png)

The status should show **active (running)**.

### Configuring Elasticsearch

**Elasticsearch** is a search engine used for indexing and searching large volumes of data, including alerts, cases, and observables.

**Configuration File**: Both `.yml` and `.yaml` extensions work identically; `.yaml` is more commonly used.

```bash
sudo nano /etc/elasticsearch/elasticsearch.yml
```

**Required Changes:**

```yaml
cluster.name: thehive-cluster  # Different from Cassandra cluster name
node.name: thehive-node-1
network.host: <TheHive_Public_IP>
http.port: 9200
cluster.initial_master_nodes: ["thehive-node-1"]  # Remove second node
```

![Elasticsearch Configuration](/assets/img/soc_automation/soc_14.png)

![Elasticsearch Settings](/assets/img/soc_automation/soc_15.png)

### Configuring TheHive

**Directory Ownership Configuration:**

The `chown` command changes ownership of files and directories. The `-R` flag applies changes recursively to all subdirectories.

```bash
sudo chown -R thehive:thehive /opt/thp
```

**TheHive Application Configuration:**

```bash
sudo nano /etc/thehive/application.conf
```

**Required Settings:**

```conf
db.janusgraph {
  storage {
    backend: cql
    hostname: ["<TheHive_Public_IP>"]
    cql {
      cluster-name: TheHive_Cluster  # Match Cassandra cluster name
    }
  }
  index.search {
    backend: elasticsearch
    hostname: ["<TheHive_Public_IP>"]
  }
}

application.baseUrl: "http://<TheHive_Public_IP>:9000"
```

![TheHive Configuration](/assets/img/soc_automation/soc_16.png)

![TheHive Settings](/assets/img/soc_automation/soc_17.png)

---

## Part 4: Troubleshooting Common Errors

### Elasticsearch OOM (Out of Memory) Error

When verifying services, you may notice Elasticsearch failed to start:

```bash
sudo systemctl status elasticsearch thehive cassandra
```

![Service Status Check](/assets/img/soc_automation/soc_18.png)

**Investigating with journalctl:**

```bash
sudo journalctl -xe
```

- `-x`: Provides detailed context for log messages
- `-e`: Jumps to the end of the journal (most recent entries)

![journalctl Output](/assets/img/soc_automation/soc_19.png)

**Diagnosis**: Elasticsearch's Java process was killed by the OOM (Out of Memory) killer. The system sacrificed Elasticsearch to free up RAM.

![OOM Error](/assets/img/soc_automation/soc_20.png)

**Solution**: Increase droplet RAM to 8 GB or configure Elasticsearch heap size.

### TheHive Connection Refused Error

**Error**: `ERR_CONNECTION_REFUSED` when accessing TheHive web interface.

**This indicates**:
- The service isn't running
- The port (9000) is not open
- Firewall is blocking the connection

**Advanced Troubleshooting:**

`journalctl` only shows systemd's view. For deeper investigation, check application logs:

```bash
sudo cat /var/log/thehive/application.log | grep -i error
sudo cat /var/log/thehive/application.log | grep -i exception
```

![Log Investigation](/assets/img/soc_automation/soc_21.png)

![Error Details](/assets/img/soc_automation/soc_22.png)

**Root Cause**: JanusGraph (TheHive's graph database layer) couldn't connect to Cassandra on port 9042. TheHive requires its backend storage connection before it can start.

**Solution**:

```bash
sudo systemctl restart cassandra
sleep 10
sudo systemctl restart elasticsearch
sleep 10
sudo systemctl restart thehive
```

![Service Restart](/assets/img/soc_automation/soc_23.png)

### Accessing TheHive

Navigate to `http://<TheHive_Public_IP>:9000`

**Default Credentials:**
- Username: `admin@thehive.local`
- Password: `secret`

![TheHive Login](/assets/img/soc_automation/soc_24.png)

**Important**: Change the default password immediately after first login.

---

## Part 5: Wazuh Agent Configuration

### Installing Wazuh Agent on Windows

1. Access the Wazuh Dashboard
2. Navigate to Agents → Add Agent
3. Select Windows as the operating system
4. Copy the PowerShell installation command
5. Run PowerShell as Administrator on your Windows VM
6. Paste and execute the command

![Wazuh Agent Installation](/assets/img/soc_automation/soc_25.png)

### Verifying Agent Connection

Check the Wazuh Dashboard—it should display 1 connected agent.

![Agent Verification](/assets/img/soc_automation/soc_26.png)

### Configuring OSSEC for Sysmon Integration

**ossec.conf** is the primary configuration file for OSSEC (Wazuh's core engine), defining behavior and settings for both manager and agents.

**File Locations:**
- **Linux**: `/var/ossec/etc/ossec.conf`
- **Windows**: `C:\Program Files (x86)\ossec-agent\ossec.conf`

**Add Sysmon Monitoring:**

1. Open `ossec.conf` in Notepad (as Administrator)
2. Add the following configuration:

```xml
<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>
```

**Configuration Explanation:**
- `<localfile>`: Defines a new log source to monitor
- `<location>`: Specifies the Windows Event Channel (Sysmon logs)
- `<log_format>`: Indicates this is an event channel format

**Finding the Exact Channel Name:**

1. Open Event Viewer
2. Navigate to: Applications and Services Logs → Microsoft → Windows → Sysmon
3. Right-click Sysmon → Properties
4. Copy the full channel name

![Event Viewer](/assets/img/soc_automation/soc_28.png)

![Sysmon Channel](/assets/img/soc_automation/soc_27.png)

3. Restart the Wazuh agent service

**Benefits**: This configuration allows Wazuh to capture and analyze all Sysmon events, including:
- Process creation
- Network connections
- File modifications
- Registry changes

![Sysmon Integration Complete](/assets/img/soc_automation/soc_30.png)

---

## Part 6: Simulating Threats with Mimikatz

### Understanding Mimikatz

**Mimikatz** is a post-exploitation tool that extracts authentication credentials from Windows systems. While often used by attackers, it's valuable for security testing and understanding credential theft techniques.

**Key Capabilities:**

| Technique | Description | Impact |
|-----------|-------------|--------|
| **Credential Dumping** | Extracts plaintext passwords, hashes, PINs, and Kerberos tickets from memory | Direct credential theft |
| **Pass the Hash** | Authenticates without the plaintext password using NTLM hashes | Lateral movement |
| **Pass the Ticket** | Captures and reuses Kerberos tickets | Impersonation attacks |
| **Golden Ticket** | Creates forged Kerberos tickets with unlimited access | Domain-wide persistence |
| **Pass the Key** | Uses password hashes to request Kerberos tickets | Stealthy authentication |

**MITRE ATT&CK Mapping**: T1003 (OS Credential Dumping)

![Mimikatz Overview](/assets/img/soc_automation/soc_29.png)

**Important Note**: Patch management is critical. Mimikatz exploits known vulnerabilities that are often already patched in up-to-date systems.

### Downloading and Configuring Mimikatz

1. Download Mimikatz from the [official GitHub repository](https://github.com/gentilkiwi/mimikatz)
2. **Exclude from Windows Defender** (for lab purposes only):
   - Windows Security → Virus & Threat Protection
   - Manage Settings → Exclusions
   - Add the Downloads folder

3. Extract the ZIP file

**Security Note**: In a production environment, never disable antivirus protection. This is strictly for controlled lab testing.

### Enabling Full Logging in Wazuh

To capture all security events, we need to configure Wazuh to archive all logs:

**1. Modify Filebeat Configuration** (on Wazuh Manager):

```bash
sudo nano /etc/filebeat/filebeat.yml
```

Find the `filebeat.modules` section and enable archives:

```yaml
filebeat.modules:
  - module: wazuh
    archives:
      enabled: true
```

![Filebeat Configuration](/assets/img/soc_automation/soc_31.png)

**What is Filebeat?**
Filebeat is a lightweight data shipper that forwards and centralizes log data. It monitors log files, collects events, and forwards them to Elasticsearch for indexing.

**2. Configure Archive Location** (ossec.conf):

```bash
sudo nano /var/ossec/etc/ossec.conf
```

Logs will be saved in `/var/ossec/logs/archives/`

![Archive Configuration](/assets/img/soc_automation/soc_32.png)

**3. Restart Wazuh Manager:**

```bash
sudo systemctl restart wazuh-manager
```

### Understanding Log Indexing

**Indexing** organizes log data to enable faster searches by creating data structures that reduce scan time during queries.

**Benefits:**
- Reduced resource usage
- Faster pattern analysis
- Easier issue identification

**Watch for**: Duplicate log entries may indicate misconfigurations that waste storage space.

![Log Indexing](/assets/img/soc_automation/soc_33.png)

### Testing Mimikatz Detection

1. Run Mimikatz on the Windows agent:

```powershell
.\mimikatz.exe
```

2. Open Event Viewer
3. Navigate to Windows Logs → Security
4. Look for Event ID 1 (Process Create)

![Event Viewer Detection](/assets/img/soc_automation/soc_35.png)

5. Check Wazuh Dashboard for the alert

![Wazuh Detection](/assets/img/soc_automation/soc_36.png)

The alert confirms that Wazuh successfully detected the Mimikatz execution.

---

## Part 7: Creating Custom Detection Rules

### Why Custom Rules Matter

**Challenge**: What if an attacker renames `mimikatz.exe` to `notepad.exe`?
**Solution**: Create a custom rule that detects Mimikatz based on file metadata, not just the filename.

![Custom Rule Need](/assets/img/soc_automation/soc_37.png)

### Understanding the Wazuh Ruleset

The **Wazuh ruleset** is a collection of predefined conditions and patterns written in XML format that analyze incoming log data.

**Components:**
- **Rules**: XML elements defining detection conditions
- **Decoders**: Parse raw logs into structured format
- **Rule Groups**: Organize rules by function or event type

**Accessing Rules:**

1. Wazuh Dashboard → Management → Rules
2. Select "Manage rules files"

![Rule Management](/assets/img/soc_automation/soc_38.png)

### Creating the Mimikatz Detection Rule

**Rule Structure:**

```xml
<rule id="100002" level="15">
  <if_group>sysmon_event1</if_group>
  <field name="win.eventdata.originalFileName">mimikatz.exe</field>
  <description>Mimikatz detected - Credential Dumping Attempt</description>
  <mitre>
    <id>T1003</id>
  </mitre>
</rule>
```

**Rule Components:**
- **ID**: Custom rules start at 100000
- **Level**: Severity from 0-15 (15 = critical)
- **Field**: Checks `win.eventdata.originalFileName` (case-sensitive)
- **MITRE ATT&CK**: Maps to T1003 (OS Credential Dumping)

**Implementation:**

1. Create a custom rules file or edit an existing one
2. Add the rule XML
3. Save the file
4. Restart Wazuh Manager when prompted

![Wazuh Rule Creation](/assets/img/soc_automation/soc_39.png)

### Testing Renamed Mimikatz

1. Rename `mimikatz.exe` to `notepad.exe`
2. Execute the renamed file
3. Check Wazuh Dashboard

![Detection Success](/assets/img/soc_automation/soc_40.png)

**Result**: The rule successfully detected Mimikatz even though the filename was changed. This is because the detection uses the original file name stored in the PE (Portable Executable) header metadata, which Sysmon captures.

---

## Part 8: Security Orchestration with Shuffle

### What is SOAR?

**SOAR** (Security Orchestration, Automation and Response) platforms streamline security operations by automating repetitive tasks and coordinating responses across multiple tools.

**Shuffle** is an open-source SOAR platform with a user-friendly interface that makes automation accessible for security teams of all skill levels.

### Understanding Workflows

A **workflow** is a series of automated steps executed in a specific sequence to accomplish security tasks.

**Workflow Components:**

| Component | Purpose |
|-----------|---------|
| **Apps** | Perform specific actions (API calls, data transformations) |
| **Triggers** | Initiate workflows based on events, time, or conditions |
| **Variables** | Store and reuse data throughout the workflow |
| **Conditions** | Control flow based on logic (if/then/else) |

**Example Workflow:**

```
Trigger: SIEM alert detected
   ↓
Enrichment: Query VirusTotal for threat intelligence
   ↓
Detection: Check if hash matches known malware
   ↓
Decision: Threat detected?
   ├─ YES → Isolate affected system + Create TheHive case
   └─ NO → Log and dismiss
   ↓
Verification: Confirm threat mitigated
```

### Setting Up Shuffle Workflow

**1. Create a New Workflow:**

1. Access Shuffle at `http://<shuffle-server>:3001`
2. Create a new workflow named "Wazuh to TheHive"
3. Add a Webhook trigger

**2. Integrate Wazuh with Shuffle:**

Edit Wazuh's configuration to send alerts to Shuffle:

```bash
sudo nano /var/ossec/etc/ossec.conf
```

Add the integration block:

```xml
<integration>
  <name>shuffle</name>
  <hook_url>http://<SHUFFLE_IP>:3001/api/v1/hooks/webhook_<YOUR_WEBHOOK_ID></hook_url>
  <level>3</level>
  <alert_format>json</alert_format>
</integration>
```

- **level**: Only forward alerts at severity level 3 or higher
- **alert_format**: Send alerts in JSON format

**3. Restart Wazuh Manager:**

```bash
sudo systemctl restart wazuh-manager
```

**4. Test the Integration:**

1. Run Mimikatz (renamed as `notepad.exe`) on the Windows agent
2. In Shuffle, start the Webhook
3. Select "Show executions"
4. Verify you see the Wazuh alert

![Shuffle Webhook Test](/assets/img/soc_automation/soc_41.png)

**Success Indicator**: You should see alert data containing "mimikatz" or "T1003" in the execution details.

---

## Part 9: Complete SOAR Automation Workflow

### Workflow Overview

Our complete automation workflow will:

1. **Receive** alerts from Wazuh via webhook
2. **Extract** file hash from the alert
3. **Enrich** with VirusTotal threat intelligence
4. **Analyze** the enrichment data
5. **Create** a case in TheHive if threat is confirmed
6. **Notify** the security team

### Step 1: Parse Wazuh Alert

**Shuffle App**: JSON Parse
**Purpose**: Extract relevant fields from the Wazuh alert

**Configuration:**
```json
{
  "alert_id": "$exec.text.id",
  "agent_name": "$exec.text.agent.name",
  "rule_description": "$exec.text.rule.description",
  "rule_level": "$exec.text.rule.level",
  "file_hash": "$exec.text.data.win.eventdata.hashes",
  "original_file_name": "$exec.text.data.win.eventdata.originalFileName",
  "process_command_line": "$exec.text.data.win.eventdata.commandLine"
}
```

### Step 2: Extract SHA256 Hash

**Shuffle App**: Regex
**Purpose**: Extract only the SHA256 hash from the hashes field

**Pattern**: `SHA256=([A-Fa-f0-9]{64})`

**Output Variable**: `$sha256_hash`

### Step 3: Query VirusTotal

**Shuffle App**: VirusTotal
**Purpose**: Check if the file hash is known malware

**Prerequisites:**
1. Create a free VirusTotal account
2. Generate an API key from your account settings
3. Add the API key to Shuffle's VirusTotal app configuration

**Configuration:**
- **Action**: Get File Report
- **Resource**: `$sha256_hash`
- **API Key**: `<YOUR_VIRUSTOTAL_API_KEY>`

**Response Data:**
```json
{
  "positives": <number of AV engines that flagged as malicious>,
  "total": <total AV engines>,
  "permalink": "<link to VT report>",
  "scan_date": "<when file was last scanned>"
}
```

### Step 4: Conditional Check

**Shuffle App**: Condition
**Purpose**: Only create TheHive case if threat is confirmed

**Logic:**
```
IF $virustotal.positives > 5 THEN
  Proceed to TheHive case creation
ELSE
  Log and end workflow
END IF
```

**Explanation**: We consider a file malicious if more than 5 antivirus engines detected it. Adjust this threshold based on your organization's risk tolerance.

### Step 5: Create TheHive Case

**Shuffle App**: TheHive
**Purpose**: Create an incident case for investigation

**Prerequisites:**
1. Create an API key in TheHive:
   - Login → Organization → Users → Create API Key
2. Add TheHive app credentials in Shuffle

**Case Configuration:**

```json
{
  "title": "Mimikatz Detection - $alert.agent_name",
  "description": "Wazuh detected potential credential dumping activity.\n\n**Alert Details:**\n- Alert ID: $alert.alert_id\n- Rule: $alert.rule_description\n- Severity: $alert.rule_level\n- Agent: $alert.agent_name\n\n**File Information:**\n- Original Name: $alert.original_file_name\n- SHA256: $sha256_hash\n- VirusTotal Detections: $virustotal.positives/$virustotal.total\n- VT Report: $virustotal.permalink\n\n**Process Details:**\n- Command Line: $alert.process_command_line",
  "severity": 3,
  "tlp": 2,
  "tags": ["mimikatz", "credential-dumping", "T1003", "automated"],
  "tasks": [
    {"title": "Review VirusTotal report", "status": "Waiting"},
    {"title": "Isolate affected endpoint", "status": "Waiting"},
    {"title": "Check for lateral movement", "status": "Waiting"},
    {"title": "Review authentication logs", "status": "Waiting"},
    {"title": "Document findings", "status": "Waiting"}
  ]
}
```

**Field Explanations:**
- **severity**: 1 (Low) to 4 (Critical)
- **tlp**: Traffic Light Protocol - 0 (White) to 4 (Red)
- **tags**: Categorize the case for easy filtering
- **tasks**: Pre-defined investigation steps

### Step 6: Add Observables to TheHive

**Shuffle App**: TheHive (Add Observable)
**Purpose**: Attach IOCs (Indicators of Compromise) to the case

**Observables to Add:**
1. **File Hash** (SHA256):
   ```json
   {
     "dataType": "hash",
     "data": "$sha256_hash",
     "message": "Malicious file hash detected by Wazuh",
     "tags": ["mimikatz"],
     "ioc": true
   }
   ```

2. **Filename** (Original):
   ```json
   {
     "dataType": "filename",
     "data": "$alert.original_file_name",
     "message": "Original filename from PE header",
     "tags": ["executable"],
     "ioc": true
   }
   ```

3. **Hostname**:
   ```json
   {
     "dataType": "hostname",
     "data": "$alert.agent_name",
     "message": "Affected endpoint",
     "tags": ["infected-host"],
     "ioc": false
   }
   ```

### Step 7: Send Email Notification

**Shuffle App**: Email
**Purpose**: Alert the SOC team immediately

**Configuration:**

```
To: soc-team@company.com
Subject: [CRITICAL] Mimikatz Detected - Immediate Action Required
Body:
SECURITY ALERT

A high-severity security event has been automatically detected and investigated.

**Incident Summary:**
- Threat: Credential Dumping Tool (Mimikatz)
- Affected System: $alert.agent_name
- Detection Time: $timestamp
- MITRE ATT&CK: T1003 (OS Credential Dumping)

**Threat Intelligence:**
- VirusTotal Detections: $virustotal.positives/$virustotal.total engines
- Report: $virustotal.permalink

**Immediate Actions:**
1. Endpoint has NOT been automatically isolated
2. Investigate authentication logs for suspicious activity
3. Check for lateral movement indicators
4. Review TheHive case for full details: $thehive_case_url

**TheHive Case:** $thehive_case_url

---
This alert was generated automatically by the SecureYourGear SOC Automation Platform.
```

### Step 8: Log to SIEM (Optional)

**Shuffle App**: HTTP Request
**Purpose**: Send workflow results back to Wazuh for centralized logging

**Configuration:**
```json
{
  "method": "POST",
  "url": "http://<WAZUH_MANAGER>:55000/security/events",
  "headers": {
    "Authorization": "Bearer <WAZUH_API_TOKEN>"
  },
  "body": {
    "type": "soar_workflow_complete",
    "workflow_name": "mimikatz_detection",
    "case_created": true,
    "case_url": "$thehive_case_url",
    "vt_detections": "$virustotal.positives",
    "timestamp": "$timestamp"
  }
}
```

---

## Part 10: Testing the Complete Workflow

### Pre-Flight Checklist

Before testing, verify all components are operational:

**Wazuh:**
```bash
sudo systemctl status wazuh-manager
```

**TheHive:**
```bash
sudo systemctl status cassandra elasticsearch thehive
```

**Shuffle:**
- Access the web interface
- Ensure workflow is saved and activated
- Verify all app credentials are configured

### Execution Test

**1. Start Monitoring:**

- Open Wazuh Dashboard → Events
- Open TheHive → Cases
- Open Shuffle → Workflow Executions
- Keep all three tabs visible

**2. Trigger the Alert:**

On the Windows agent:
1. Rename `mimikatz.exe` to `calculator.exe` (to test metadata detection)
2. Execute the file
3. Run any Mimikatz command (e.g., `privilege::debug`)

**3. Observe the Automation:**

**Within 10 seconds**: Wazuh alert appears
**Within 30 seconds**: Shuffle workflow executes
**Within 60 seconds**: TheHive case is created
**Within 90 seconds**: Email notification sent

### Verification Steps

**1. Check Wazuh Alert:**
```
Rule: 100002 - Mimikatz detected
Level: 15 (Critical)
MITRE: T1003
```

**2. Check Shuffle Execution:**
- All apps should show green checkmarks
- VirusTotal results should show 60+ detections
- TheHive case ID should be returned

**3. Check TheHive Case:**
- Title includes agent name
- Description contains all alert details
- 5 tasks are created and waiting
- 3 observables are attached (hash, filename, hostname)

**4. Check Email:**
- Email received by SOC team
- Contains clickable links
- Shows VirusTotal detection count

---

## Part 11: Advanced Enhancements

### Enhancement 1: Automated Endpoint Isolation

**Tool Required**: Wazuh Active Response

**Configuration** (ossec.conf):

```xml
<command>
  <name>isolate-endpoint</name>
  <executable>isolate.sh</executable>
  <timeout_allowed>no</timeout_allowed>
</command>

<active-response>
  <command>isolate-endpoint</command>
  <location>local</location>
  <rules_id>100002</rules_id>
</active-response>
```

**Script** (`/var/ossec/active-response/bin/isolate.sh`):

```bash
#!/bin/bash
# Block all network traffic except to Wazuh Manager
iptables -A INPUT -s <WAZUH_MANAGER_IP> -j ACCEPT
iptables -A OUTPUT -d <WAZUH_MANAGER_IP> -j ACCEPT
iptables -A INPUT -j DROP
iptables -A OUTPUT -j DROP
echo "Endpoint isolated at $(date)" >> /var/log/isolation.log
```

### Enhancement 2: Slack Integration

Add a Slack notification app to the Shuffle workflow:

**Shuffle App**: Slack
**Action**: Send Message
**Channel**: #soc-alerts
**Message**:
```
:rotating_light: *CRITICAL SECURITY ALERT* :rotating_light:

*Threat*: Mimikatz Credential Dumping
*System*: `$alert.agent_name`
*Time*: $timestamp

*VirusTotal*: $virustotal.positives/$virustotal.total detections
*TheHive Case*: <$thehive_case_url|View Case>

*Recommended Actions*:
• Isolate endpoint immediately
• Review authentication logs
• Check for lateral movement
```

### Enhancement 3: Automated Forensics Collection

Add a PowerShell script that automatically collects forensic artifacts:

```powershell
# Collect memory dump
.\DumpIt.exe /O C:\forensics\memory.dmp

# Collect running processes
Get-Process | Export-Csv C:\forensics\processes.csv

# Collect network connections
Get-NetTCPConnection | Export-Csv C:\forensics\connections.csv

# Collect recently modified files
Get-ChildItem C:\ -Recurse -ErrorAction SilentlyContinue |
  Where-Object {$_.LastWriteTime -gt (Get-Date).AddHours(-2)} |
  Export-Csv C:\forensics\recent_files.csv

# Upload to TheHive
$caseId = "$thehive_case_id"
Invoke-RestMethod -Uri "http://<THEHIVE>/api/case/$caseId/artifact" `
  -Method POST -InFile "C:\forensics\memory.dmp" `
  -Headers @{"Authorization"="Bearer $api_key"}
```

### Enhancement 4: Threat Hunting Dashboard

Create a custom Wazuh dashboard to track:
- Mimikatz detection frequency over time
- Affected endpoints (heat map)
- Detection by file name (to identify evasion attempts)
- Response time metrics (detection to case creation)

---

## Part 12: Lessons Learned and Best Practices

### Key Takeaways

**1. Defense in Depth Works**
- Multiple detection layers (Sysmon + Wazuh + Custom Rules) increase detection confidence
- Metadata-based detection (original filename) defeats simple evasion

**2. Automation Reduces Response Time**
- Manual workflow: 15-30 minutes
- Automated workflow: 60-90 seconds
- **95%+ time reduction**

**3. Threat Intelligence is Critical**
- VirusTotal enrichment provides instant context
- External validation reduces false positives
- Shared intelligence benefits the entire security community

**4. Documentation Prevents Mistakes**
- Clear runbooks ensure consistent responses
- Automated task creation guides analysts
- Lessons learned improve future detection

### Common Pitfalls to Avoid

**1. Alert Fatigue**
- Don't forward all alerts to TheHive
- Use severity thresholds (Level 10+)
- Implement alert aggregation

**2. Credential Management**
- Never hardcode API keys in workflows
- Use Shuffle's credential storage
- Rotate API keys regularly

**3. Resource Constraints**
- 8 GB RAM is minimum for production
- Monitor Elasticsearch heap usage
- Implement log retention policies

**4. Network Segmentation**
- Isolate lab environment from production
- Use VLANs or separate physical networks
- Never test real malware on production systems

### Performance Tuning

**Wazuh Manager:**
```xml
<global>
  <jsonout_output>yes</jsonout_output>
  <alerts_log>yes</alerts_log>
  <logall>no</logall>  <!-- Disable to reduce disk usage -->
  <logall_json>no</logall_json>
</global>
```

**Elasticsearch:**
```yaml
indices.query.bool.max_clause_count: 4096
bootstrap.memory_lock: true
```

**Cassandra:**
```yaml
concurrent_reads: 32
concurrent_writes: 32
memtable_allocation_type: heap_buffers
```

---

## Conclusion

You've successfully built a production-ready **SOC automation lab** that demonstrates enterprise-level security operations capabilities. This complete end-to-end implementation showcases:

- **Endpoint Monitoring** – Wazuh SIEM and Sysmon telemetry collection
- **Threat Detection** – Custom detection rules aligned with MITRE ATT&CK framework
- **Threat Intelligence Enrichment** – VirusTotal API integration for IOC validation
- **Security Orchestration** – Shuffle SOAR platform for workflow automation
- **Incident Management** – TheHive case management and observables tracking
- **Automated Response** – Complete workflow from detection to case creation in under 90 seconds

### Skills Developed

Through this lab, you've gained hands-on experience with:

- **SIEM Deployment**: Cloud infrastructure setup and Wazuh configuration
- **Log Analysis**: Parsing security events and identifying malicious patterns
- **Detection Engineering**: Writing custom rules with field-based matching and severity scoring
- **SOAR Workflow Design**: Building automated playbooks with conditional logic and API integrations
- **Cloud Infrastructure**: Managing Digital Ocean droplets and service dependencies
- **Incident Response**: Creating structured cases with tasks, observables, and enrichment data
- **Threat Intelligence**: Integrating external feeds for context-driven decision making

This lab demonstrates real-world SOC automation techniques used by security teams to protect organizations from credential theft, lateral movement, and advanced persistent threats. The skills and architecture patterns you've implemented here are directly applicable to enterprise security operations.
