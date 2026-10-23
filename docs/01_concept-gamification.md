# Concept: Gamification & User Motivation

This project builds on the principles of **gamification in digital engagement**, combining psychological research and practical strategies to increase user retention, satisfaction, and participation.

The following insights are based on the peer-reviewed article  
**"From Engagement to Retention: The Power of Gamification in Digital Marketing"**  
published in the *Journal of Information Systems Engineering and Management* (Issue 10, 2025).  
📖 [Read the full article](https://www.researchgate.net/publication/391720545_From_Engagement_to_Retention_The_Power_of_Gamification_in_Digital_Marketing)

---

## The Four Core Pillars of Gamification Strategy

### 1. Gamification
Game-like elements such as **points**, **levels**, and **rewards** are effective in driving user engagement.  
They provide a sense of purpose and achievement, motivating users to continue interacting with the platform.

### 2. Self-Determination Theory (SDT)
According to SDT, intrinsic motivation arises from fulfilling three basic psychological needs:
- **Autonomy**: users feel in control of their actions (e.g. choosing between rewards)
- **Competence**: users perceive progress (e.g. levels, badges)
- **Relatedness**: users feel part of a group or community (e.g. leaderboard, shoutouts)

### 3. Habit Formation
Gamification promotes **habitual use** by offering repeated, consistent incentives.  
Features such as daily tasks, streaks, and predictable feedback loops help turn occasional users into returning ones.

### 4. Ethics & User-Centricity
Acceptance is driven by:
- **Transparency** (clear rules and benefits)
- **Fairness** (no pay-to-win dynamics)
- **Low complexity** (easy onboarding and intuitive structure)

These factors foster **trust**, which is essential for sustained engagement.

---

## The Gamification Process

The article defines a clear five-stage flow from initial interest to long-term retention:

<img src="/docs/images/gamification_process.png" alt="Gamification Process" width="400" />

### 1. Initial Engagement
Trigger curiosity through clear incentives (e.g. points for signup or first interaction).  
Visual cues, badges, and “first steps” encourage users to explore further.

### 2. Continued Participation
Keep users engaged by offering varied challenges, daily tasks, or milestone rewards.  
Progress indicators and small wins support consistent motivation.

### 3. Avoiding Drop-off
Prevent stagnation or frustration by balancing difficulty and reward frequency.  
Introduce dynamic elements like **weekly leaderboards** or **randomized rewards**.

### 4. Building Emotional Connection
Let users form an identity within the system: levels, avatars, or recognition (e.g. shoutouts).  
Emotional connection increases the chance of return visits and sharing with others.

### 5. Habit Formation → Retention
Over time, the system aims to turn participation into routine.  
Recurring elements like streaks and evolving challenges help **convert engagement into habit** – and ultimately, **into long-term retention**.

> These principles serve as the theoretical foundation for the design and implementation of the egoFM reward system.

---

## Applying Theory to Practice: The egoFM Use Case

In early 2025, we became aware of egoFM’s financial situation. The independent radio station had filed for insolvency and was calling on its community for support. The incredible public response – over €110,000 raised within days – showed the **strong bond between egoFM and its listeners**.

Moved by this commitment, we saw an opportunity to contribute through our master’s project. Our goal: not just a temporary fix, but a **long-term, scalable concept** that empowers egoFM to activate its community in new ways.

### Core Idea

The system we designed translates the previously outlined gamification principles into a tailored solution for egoFM:

- **Foster engagement**  
  → Motivate listeners to interact regularly with egoFM via a playful reward system.

- **Strengthen loyalty**  
  → Build a long-term connection through levels, badges, and exclusive rewards.

- **Support monetization**  
  → Increase willingness to donate and unlock new monetization opportunities through incentives.

### Project Kickoff with egoFM

We prepared a pitch presentation (see [Pitch Presentation (PDF)](/docs/presentations/egoFM_Pitch.pdf)) and presented our initial concept to the egoFM team. The response was encouraging: the idea was seen as a meaningful and timely contribution.

Together, we defined the scope of the project as follows:

> **"Development of a web-based points and reward system to reinforce and reward interactions from engaged listeners – with the goal of sustainably increasing participation, community involvement, and donation readiness. By boosting activity and reach, egoFM can gain new financial perspectives."**

<img src="/docs/images/use_case_diagram.png" alt="Use Case Diagram" width="400" />

---

## System Design

Following the initial approval of our idea, we began refining a concept. The system is made up of **several interconnected components** that together form a coherent user experience.

### Points & Actions

Users earn points by completing defined actions. Some are one-time, others recurring with daily or monthly limits.

| Action                        | Points                | Frequency               |
|------------------------------|------------------------|--------------------------|
| Create an account            | 100                   | once                    |
| Listen to egoFM (1h)         | 20                    | up to 5× per day        |
| Make a donation              | 10 points per €1      | unlimited               |
| Subscribe to paid stream     | 250                   | monthly                 |
| Follow on social media       | 50                    | once per platform       |
| Share content                | 30                    | max. 1× per day         |
| Invite a friend              | 150                   | per successful invite   |
| Write a review               | 100                   | once                    |
| Birthday bonus               | 50                    | annually                |

### Levels

<img src="/docs/images/level.png" alt="Level" width="750" />

The level system structures user progression. Higher levels unlock better rewards.

| Level         | Points Required |
|---------------|------------------|
| Listener      | 0 – 499          |
| Supporter     | 500 – 1499       |
| Fan           | 1500 – 2999      |
| Insider       | 3000 – 4999      |
| Die-Hard Ego  | 5000 – 7499      |
| Champion      | 7500+            |

### Streaks

To encourage daily engagement, we implemented a streak system that rewards consistent activity:

| Streak                  | Bonus Points | Requirement                                 |
|-------------------------|--------------|---------------------------------------------|
| 3-day streak            | +25          | Listen on 3 consecutive days                |
| 7-day streak            | +50          | Listen 7 days in a row                      |
| Every additional 7 days | +100         | E.g. 14, 21, 28 days                        |

<img src="/docs/images/streak.png" alt="Streak" width="250" />

### Emotional Feedback & Character-Driven Interaction

One of the most powerful tools in gamified systems is immediate, emotional feedback. Recent research and industry insights highlight the role of visual characters in reinforcing user motivation through expressive, reactive behavior.

#### Inspiration: Duolingo’s Character System

[Duolingo](https://www.duolingo.com/) – one of the most successful gamified learning platforms worldwide – attributed part of its user growth to its cast of expressive characters. After introducing animated feedback through character reactions, facial expressions, and gentle animations, **Duolingo doubled its daily active user base**.

Their design system includes clear guidelines for shape language, emotional states, simplified expressions, and consistent feedback loops. Characters visibly react to success, failure, and progress, creating **a sense of companionship, positive reinforcement, and user retention** ([source](https://design.duolingo.com/illustration/characters)).

In a deep-dive on animation tooling and interaction design, Duolingo also shared how they use *viseme-based animation logic* to lip-sync their characters to real-time speech feedback, enhancing expressiveness across platforms ([read more](https://blog.duolingo.com/world-character-visemes/)).

#### Our Approach: Adapting the Principle to egoFM

To leverage this emotional dynamic, we integrated a **character-based feedback system into our streak mechanic**. Inspired by Duolingo, we created a customized egoFM character that:

- **Celebrates user achievements** (e.g. 3-day or 7-day streaks),
- and strengthens **habit formation** by associating daily interaction with positive feelings.

We began with an existing visual from the blogpost ["Rette egoFM: Dein Support zählt"](https://www.egofm.de/blog/support-egofm-insolvenz), originally portraying a concerned mascot in the context of egoFM’s financial struggles. Using [Sora](https://openai.com/sora), we reimagined the character as a cheerful and reactive companion.

<img src="/docs/images/character_before_after.png" alt="Character: Before & After" width="500" />

### Leaderboards

To strengthen community interaction and friendly competition:

- **All-time & weekly leaderboards** display the top 10 users.
- **Weekly shoutouts** in the stream for the top 3 users.

<img src="/docs/images/leaderboard.png" alt="Leaderboards" width="500" />

### Rewards

Reward logic plays a central role in user motivation and is closely aligned with Self-Determination Theory:

- On every **level-up**, users are presented with **two random rewards** to choose from.
- Rewards are organized in **level-based pools**. Each new level **expands** the pool (not replaces it).
- Each reward is **redeemable only once**, fostering a collection mindset (badge view in the profile)
- Rewards may be:
  - **Digital**: wallpapers, playlists, shoutouts
  - **Interactive**: quiz participation, song requests
  - **Tangible**: merch, event access, coupons

<img src="/docs/images/rewards.png" alt="Reward Pools" width="400" />


### Tech Stack Overview

The application is designed with a containerized web architecture:

| Layer             | Technology       |
|------------------|------------------|
| Runtime           | Docker + Compose |
| Frontend          | Angular          |
| Backend           | NestJS           |
| Database          | PostgreSQL       |
| Web Server        | NGINX            |

<img src="/docs/images/techstack.png" alt="Tech Stack" width="600" />

> For a full visual overview of the concept and system logic, see our [Concept Presentation (PDF)](/docs/presentations/egoFM_Concept.pdf).
