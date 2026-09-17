# Bug Report Registry

| Defect ID | Summary | Steps to Reproduce | Expected Result | Actual Result | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Add Member search query filter experiences formatting overflow states when matching large datasets. | 1. Navigate to `/manage-team`<br>2. Select `+ MEMBER`<br>3. Type 'a' into user query input. | Dropdown overlay components open cleanly above standard container limits, using scroll tracks effectively. | Viewport stretches awkwardly below screen visibility boundaries; confirmation triggers flow out of screen bounds. | Medium | Open |
| **BUG-002** | Role selection radio checkboxes accept conflicting overlapping permissions during high-latency requests. | 1. Open Team Member configuration modal.<br>2. Rapidly toggle distinct roles simultaneously during network lag. | Form UI should handle debounce actions or instantly override contradictory access settings. | UI permits selecting conflicting rules, leading to processing failures upon clicking save. | High | Open |
