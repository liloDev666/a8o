# 👑 Guild Role System

The A8O Guild Bot includes a complete role-based permission system matching Lords Mobile guild hierarchy!

## Role Hierarchy

| Role | Name | Emoji | Level | Members |
|------|------|-------|-------|---------|
| R5 | Leader | 👑 | 5 | 1 (Guild Leader) |
| R4 | Officer | ⭐ | 4 | Multiple |
| R3 | Elite | 💎 | 3 | Multiple |
| R2 | Veteran | 🛡️ | 2 | Multiple |
| R1 | Member | ⚔️ | 1 | Everyone else |

## Permissions by Role

### 👑 R5 - Leader
**Full Control** - All permissions
- Assign/change any role
- All R4 permissions
- Guild settings management
- Bot configuration

### ⭐ R4 - Officer
**Management** - High-level permissions
- ✅ Manage members (promote/demote R1-R3)
- ✅ Manage events
- ✅ Send announcements
- ✅ Manage targets
- ✅ Start contests
- ✅ All R3 permissions

### 💎 R3 - Elite
**Coordination** - Mid-level permissions
- ✅ Manage events
- ✅ Manage targets
- ✅ Add battles
- ✅ All R2 permissions

### 🛡️ R2 - Veteran
**Active** - Basic permissions
- ✅ Add battles
- ✅ Add resources
- ✅ All R1 permissions

### ⚔️ R1 - Member
**Standard** - View permissions
- ✅ View all information
- ✅ Add resources
- ✅ Participate in events
- ✅ Use basic commands

## Commands

### View Roles
```
/roles      - View guild hierarchy and members
/myrole     - View your role and permissions
```

### Manage Roles (R5 Only)
```
/setrole @username R4    - Assign specific role
/setrole PlayerName R3   - Works with game names too
```

### Promote/Demote (R4+)
```
/promote @username    - Promote member one level
/demote @username     - Demote member one level
```

## Examples

### Assigning Roles (R5 Only)
```
/setrole @JohnDoe R4
✅ ⭐ JohnDoe promoted to Officer (R4)!
Permissions: manage_members, manage_events, announce, manage_targets, manage_contests

/setrole DragonSlayer R3
✅ 💎 DragonSlayer promoted to Elite (R3)!
Permissions: manage_events, manage_targets, add_battles
```

### Promoting Members (R4+)
```
/promote @NewPlayer
🎉 🛡️ NewPlayer promoted to Veteran (R2)!
```

### Checking Your Role
```
/myrole

⭐ Your Role: Officer (R4)

Permissions:
✅ manage_members
✅ manage_events
✅ announce
✅ manage_targets
✅ manage_contests

Your Stats:
⚔️ Might: 45,000,000
💀 Kills: 12,500,000
🤝 Helps: 5,432
📅 Member since: 1/15/2026
```

## Permission-Restricted Commands

### R5 Only
- `/setrole` - Assign any role
- Guild settings

### R4+ Required
- `/announce` - Send announcements
- `/startcontest` - Create contests
- `/promote` - Promote members
- `/demote` - Demote members

### R3+ Required
- `/addtarget` - Add enemy targets
- `/addevent` - Create events

### R2+ Required
- `/addbattle` - Log battles

### R1+ (Everyone)
- `/addresource` - Log resources
- All view commands
- Profile commands

## Auto-Assignment

- New members automatically get **R1 (Member)** role
- Guild leader should manually assign R5 to themselves
- Officers (R4) can promote members up to R3
- Only R5 can assign R4 and R5 roles

## Best Practices

1. **R5 (Leader)**: Assign to guild leader only
2. **R4 (Officers)**: Trusted members who help manage (2-5 people)
3. **R3 (Elite)**: Active coordinators (5-10 people)
4. **R2 (Veterans)**: Regular active members
5. **R1 (Members)**: New or casual members

## Setup Your Guild

1. **Leader registers first:**
   ```
   /register YourGameName
   ```

2. **Leader assigns themselves R5:**
   ```
   /setrole @YourUsername R5
   ```

3. **Assign officers:**
   ```
   /setrole @Officer1 R4
   /setrole @Officer2 R4
   ```

4. **Officers can promote others:**
   ```
   /promote @ActiveMember
   ```

## Permission Checks

When a member tries to use a restricted command:

**Example 1: R1 tries to announce**
```
/announce Important message
❌ Only R4+ can send announcements!
```

**Example 2: R2 tries to start contest**
```
/startcontest Kill Event | kills | 24
❌ You need R4+ permissions to start contests!
```

**Example 3: R4 tries to add target (Success)**
```
/addtarget EnemyKing | [XYZ] | 80000000
🎯 New Target Added!
```

## Role Display

Roles are shown in:
- Member profiles (`/profile`)
- Member lists (`/members`)
- Battle reports
- Event participation
- Leaderboards

Example member list:
```
👥 A8O Guild Members (25)

👑 DragonKing (R5)
   Might: 100,000,000 | Kills: 50,000,000

⭐ Officer1 (R4)
   Might: 75,000,000 | Kills: 30,000,000

⭐ Officer2 (R4)
   Might: 70,000,000 | Kills: 28,000,000

💎 ElitePlayer (R3)
   Might: 60,000,000 | Kills: 20,000,000
```

## Notes

- Roles persist across bot restarts
- Roles are stored in member profiles
- Can't demote below R1 or promote above R4 (except R5 can assign R5)
- R5 can change anyone's role directly
- R4 can only promote/demote R1-R3

---

**Organize your guild with proper hierarchy!** 👑
