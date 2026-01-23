# How to Revert to Full Functionality

This guide explains how to toggle the application back to the full "Program Selection" mode (supporting Cohorts, On-Demand, and Workshops).

The application is currently in **WORKSHOP_ONLY_MODE**.

## 1. Modify `src/App.tsx`

Search for the comment `WORKSHOP_ONLY_MODE` in this file to find the lines to change.

### Step 1.1: Reset Initial State
Change the initial state of `currentStep` back to `0`:
```typescript
// Current
const [currentStep, setCurrentStep] = useState<number>(1) // WORKSHOP_ONLY_MODE...

// Revert to
const [currentStep, setCurrentStep] = useState<number>(0)
```

### Step 1.2: Reset Default Program Type
Change the default `programType` back to `'cohort'` (or whatever you prefer as default):
```typescript
// Current
const [programType, setProgramType] = useState<'cohort' | 'ondemand' | 'workshop'>('workshop') // WORKSHOP_ONLY_MODE...

// Revert to
const [programType, setProgramType] = useState<'cohort' | 'ondemand' | 'workshop'>('cohort')
```

### Step 1.3: Uncomment Step 0 Rendering
Uncomment the block that renders `CourseSelection`:
```typescript
// Current
{/* WORKSHOP_ONLY_MODE: Step 0 is hidden
{currentStep === 0 && (
    <CourseSelection onSelect={handleCourseSelect} />
)}
*/}

// Revert to
{currentStep === 0 && (
    <CourseSelection onSelect={handleCourseSelect} />
)}
```

## 2. Modify `src/components/SpecificCourseSelection.tsx`

Search for `WORKSHOP_ONLY_MODE` to find the "Back to Programs" button.

### Step 2.1: Uncomment Back Button
Uncomment the button code so users can navigate back to the program selection screen:
```typescript
// Current
{/* WORKSHOP_ONLY_MODE: Back button hidden
<button onClick={onBack} ... >
    ...
</button>
*/}

// Revert to
<button onClick={onBack} ... >
    ...
</button>
```

## 3. Modify `src/components/ProgressBar.tsx`

### Step 3.1: Restore Step Labels
Uncomment the "Course Selection" step in the `steps` array:
```typescript
// Current
const steps = [
    // { label: 'Course Selection' }, // WORKSHOP_ONLY_MODE...
    { label: 'Workshop Selection' },
    ...
]

// Revert to
const steps = [
    { label: 'Course Selection' }, // This becomes Step 1
    { label: 'Specific Course' },  // This becomes Step 2 (adjust label as needed)
    ...
]
```
Note: You might need to adjust the labels slightly to match the original flow perfectly if they were different. The original code had:
```typescript
const steps = [
    { label: 'Course Selection' },
    { label: 'Registration Details' },
    ...
]
```
