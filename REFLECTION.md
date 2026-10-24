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
your **generator** rather than your property. What did the generator fail to produce? How did you fix it? Paste the runner output from before and after.

As shown below, singlePass displayed as flaky because independently generated full-alphabet words did not consistently have repeated guesses competing with a later clasified green. The existing count property could detect over-crediting, but its generator has a rarer probability to reach this situation. I added a targeted generator that constructs 3 distinct letters into secret/guess pairs that guarantees this competition, along with a direct check of the required colors.

#Before: 
<img width="792" height="52" alt="image" src="https://github.com/user-attachments/assets/7cdd2755-30bf-4312-8237-27f43bba9422" />

After: <img width="680" height="95" alt="image" src="https://github.com/user-attachments/assets/17b0f712-347d-415c-92de-14585b6e0c96" />

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.
<img width="766" height="49" alt="image" src="https://github.com/user-attachments/assets/8c663cf3-d2ce-4229-b6c9-12dc3c32a8ff" />
This counterexample shows that the mutant incorrectly handles the repeated letters within Wordle. According to the specification, green matches should be assigned first, then the remaining letters should be checked for yellow matches. 
### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.
    One module in our team’s project that could benefit from property-based testing is the learnMode comprehension answer evaluation feature. The first property (Invariant) is that correct responses to the comprehension question should allow the code edit to proceed, while incorrect answers should not allow the edit process to continue and trigger the generation of another question. The second property (Metamorphic) is that changing the capitalization or adding extra whitespace to a correct response should not change whether it is considered as correct. To test these properties, I would generate comprehension questions with expected answers and differing user responses, (including correct, incorrect, and partially correct answers). A naive generator may only produce random strings that are unrelevant to the questions, so I would need to make sure the generated responses are realistic and relevant.
