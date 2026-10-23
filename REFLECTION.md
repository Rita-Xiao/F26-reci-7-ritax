# Reflection

**Rita Xiao / ritax:**

**Recitation group members (Task 2): Matthew Darin**


---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

The property “returns exactly five colors”  killed none of the public mutants, since they still return five colors. It would catch a bug where the loop skips the last position and returns only four colors.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.
singlePass was flaky because independently generated full-alphabet words did not consistently contain repeated guesses competing with a later green. The existing count property could detect over-crediting, but its generator rarely reached that situation. I added a targeted generator that constructs three distinct letters into secret/guess pairs guaranteeing that competition, together with a direct check of the required colors.
#Before: 
<img width="792" height="52" alt="image" src="https://github.com/user-attachments/assets/7cdd2755-30bf-4312-8237-27f43bba9422" />

After: <img width="680" height="95" alt="image" src="https://github.com/user-attachments/assets/17b0f712-347d-415c-92de-14585b6e0c96" />

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.
<img width="766" height="49" alt="image" src="https://github.com/user-attachments/assets/8c663cf3-d2ce-4229-b6c9-12dc3c32a8ff" />

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

