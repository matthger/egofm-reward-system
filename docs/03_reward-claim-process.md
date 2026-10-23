# The Reward Claim Process
This page outlines the user journey of completing a task, claiming its associated reward, and leveling up within the gamification system. A full walkthrough is demonstrated in the screen recording below.  
For a more technical breakdown, including an activity diagram and step-by-step explanation, see the section **Visualization of the Process**.

![Level-Up Walkthrough](/docs/gifs/level_up_walkthrough_higher_res.gif)


## Visualization of the process
The following flowchart illustrates the user's progression from performing an action (in this case liking a post) to earning points and claiming rewards as part of the leveling system.

```mermaid
flowchart TD
  A((Start)) --> B(User opens homepage ¹)
  B --> C(User likes a post ²)
  C --> D{Action completed?}
  D -- Yes --> E(User opens rewards page)
  E --> F(User claims action ³)
  F --> G[(Credit points ⁴)]
  G --> H{New level reached?}
  H -- No --> I(((End)))
  H -- Yes --> J[Two rewards are displayed ⁵]
  J --> K(User selects a reward ⁶)
  K --> L[(Save reward ⁷)]
  L --> I
  D -- No --> I
```

### Step-by-Step Breakdown

1. The user opens the **egofm homepage** ¹.
2. On the **Rewards** page, the action "Like a post" is shown with a disabled **Claim** button, indicating it hasn't been completed yet:  
   <img src="images/disabled_action.png" alt="Disabled claim button" width="250">

3. The user then **likes a post** ²:  
   <img src="images/news_post.png" alt="Liking a post" width="250">

4. A backend action log is created, marking the action as completed. The **Claim** button is now enabled:  
   <img src="images/enabled_action.png" alt="Enabled claim button" width="250">

5. When the user presses **Claim** ³, points are added to their account ⁴.

6. The system checks whether the new point total results in a **level-up**.

7. If a level-up occurs, **two random rewards** are presented ⁵:  
   <img src="images/level_up_selection.png" alt="Level-up reward selection" width="500">

8. The user selects one reward ⁶, which is then saved ⁷ and added to their **badge collection**:  
   <img src="images/badge_collection.png" alt="Badge collection" width="500">
