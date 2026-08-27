export interface ExercisePhotoPose {
  stepNumber: number;
  stepTitle: string;
  imageUrl: string;
  postureCue: string;
  jointAlignment: string;
  motionDirection: string;
}

export interface ExerciseDetailItem {
  id: string;
  name: string;
  category: 'Strength & Tone' | 'Core & Posture' | 'Cardio & Metabolic' | 'Mobility & Joint Health';
  purpose: string;
  targetMuscles: string[];
  primaryMover: string;
  secondaryStabilizers: string[];
  startingPosition: string;
  correctForm: string;
  stepByStepInstructions: string[];
  breathingGuidance: string;
  tempoGuidance: string;
  recommendedDose: {
    sets: number;
    repsOrDuration: string;
    restBetweenSets: string;
  };
  restAndRecovery: string;
  commonMistakes: string[];
  safetyTips: string[];
  modifications?: string;
  photoSequence: ExercisePhotoPose[];
}

export const EXERCISE_GUIDE_CATALOG: ExerciseDetailItem[] = [
  {
    id: 'ex-guide-squat',
    name: 'Bodyweight Goblet Squat',
    category: 'Strength & Tone',
    purpose: 'Activates large lower-body muscle groups (quadriceps, gluteus maximus, hamstrings) to rapidly accelerate postprandial glucose disposal, optimize insulin sensitivity, and build functional leg strength.',
    targetMuscles: ['Quadriceps (Vastus Medialis / Lateralis)', 'Gluteus Maximus', 'Hamstrings', 'Core Stabilizers'],
    primaryMover: 'Quadriceps & Gluteus Maximus',
    secondaryStabilizers: ['Transverse Abdominis', 'Erector Spinae', 'Calves (Gastrocnemius)'],
    startingPosition: 'Stand tall with feet shoulder-width apart, toes pointing outward 10-15°. Hold hands clasped at your chest or cradle a dumbbell vertically against your sternum. Shoulders are pulled down and back.',
    correctForm: 'Keep your chest lifted high at roughly 65° and distribute bodyweight evenly through your midfoot and heels. Both knees must track outward directly in line with your second toe throughout the descent.',
    stepByStepInstructions: [
      '**1. Starting Position**: Stand tall with feet shoulder-width apart, toes turned out 10°, and core cylinder braced tightly.',
      '**2. Movement Into Exercise (Descent)**: Inhale through your nose as you push hips back and bend knees, lowering your body under control over 3 full seconds.',
      '**3. Lowest Position (Parallel Depth)**: Descend until hip crease is level with or slightly below kneecaps (90° knee angle). Torso remains proud with flat lower back.',
      '**4. Return to Starting Position**: Exhale forcefully through pursed lips, drive straight down through your heels, and extend hips to stand tall, squeezing glutes firmly at top.'
    ],
    breathingGuidance: 'Inhale deeply through your nose as you lower into the squat (eccentric phase); exhale forcefully through your mouth as you drive up to standing (concentric phase).',
    tempoGuidance: '3-1-1-1 Tempo: 3 seconds down, 1 second pause at parallel, 1 second explosive drive up, 1 second glute lockout.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '12 - 15 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Rest 60 seconds between sets. Walk around lightly and take small sips of water to maintain muscle hydration.',
    commonMistakes: [
      'Allowing knees to cave inward (valgus collapse) during the upward drive',
      'Lifting heels off the ground, placing excessive shear force on the patellar tendon',
      'Rounding the lower back and pitching the chest excessively forward'
    ],
    safetyTips: [
      'If you experience knee tightness, stop at 90 degrees or squat onto an 18-inch sturdy chair/bench',
      'Keep your eyes looking forward and slightly downward (not up at the ceiling) to protect cervical spine'
    ],
    modifications: 'Beginner: Chair Box Squats (sit to stand). Advanced: 3-Second Isometric Pause at the bottom with a 5kg-10kg dumbbell.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Stand tall with feet shoulder-width apart, toes angled 10° out. Hands clasped at chest.',
        jointAlignment: 'Spine neutral • Weight centered over midfoot • Shoulders relaxed down',
        motionDirection: 'Inhale & Brace Core ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Squat',
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Push hips backward and bend knees simultaneously. Lower body under control over 3s.',
        jointAlignment: 'Knees tracking over 2nd toe • Torso angled 65° upright • Heels pinned to floor',
        motionDirection: '3s Controlled Descent ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Lowest Position (Parallel)',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Hip crease drops parallel to kneecaps (90° knee angle). Pause for 1 second.',
        jointAlignment: 'Flat lower back • Chest elevated • Maximum glute and quadricep tension',
        motionDirection: 'Drive Through Heels ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return to Stand',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Drive straight up through midfoot and heels, fully extending hips and squeezing glutes.',
        jointAlignment: 'Full hip extension • Ribs tucked down • Complete standing lockout',
        motionDirection: 'Exhale & Glute Lockout'
      }
    ]
  },
  {
    id: 'ex-guide-rdl',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Strength & Tone',
    purpose: 'Strengthens the entire posterior chain (hamstrings, gluteus maximus, spinal erectors) to correct anterior pelvic tilt, decompress lower back, and optimize metabolic rate.',
    targetMuscles: ['Hamstrings (Biceps Femoris / Semitendinosus)', 'Gluteus Maximus', 'Erector Spinae', 'Latissimus Dorsi'],
    primaryMover: 'Hamstrings & Gluteus Maximus',
    secondaryStabilizers: ['Lower Back (Erector Spinae)', 'Rhomboids', 'Forearm Grip'],
    startingPosition: 'Stand upright with feet hip-width apart holding dumbbells in front of thighs. Shoulders are pulled down and back with a soft, unlocked bend in the knees (15°).',
    correctForm: 'Maintain a flat, neutral spine throughout. The movement is a pure horizontal hip hinge: push your hips straight backward toward the wall behind you while sliding the weights down along your shins.',
    stepByStepInstructions: [
      '**1. Starting Position**: Stand tall with feet hip-width apart, retract shoulder blades, unlock knees slightly (15°), and hold dumbbells against thighs.',
      '**2. Movement Into Exercise (Hip Hinge)**: Inhale and initiate the movement purely by pushing your hips directly backward. Keep weights sliding along shins.',
      '**3. Lowest Position (Hamstring Stretch)**: Lower until dumbbells reach mid-shin and you feel a deep hamstring stretch. Keep back flat with zero rounding.',
      '**4. Return to Starting Position**: Exhale forcefully, drive hips forward, and contract glutes firmly at the top standing lockout.'
    ],
    breathingGuidance: 'Inhale as your hips travel backward into the hamstring stretch; exhale forcefully as you drive hips forward to standing.',
    tempoGuidance: '3-1-1-1 Tempo: 3 seconds lowering down, 1 second stretch hold, 1 second forward drive.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 - 12 reps',
      restBetweenSets: '75 seconds'
    },
    restAndRecovery: 'Rest 75 seconds between sets. Allow posterior chain elasticity to recover.',
    commonMistakes: [
      'Bending the knees excessively (turning the hip hinge into a squat)',
      'Allowing the dumbbells to drift away from the legs, overloading the lumbar spine',
      'Rounding the lower back into a C-shape at the bottom of the stretch'
    ],
    safetyTips: [
      'Never allow the lower back to round; stop descent when hips stop moving backward',
      'Keep dumbbells in light contact with your shins throughout the movement'
    ],
    modifications: 'Beginner: Bodyweight wall-touch hip hinges. Advanced: Single-leg Romanian deadlift.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Stand tall with feet hip-width apart, holding dumbbells against thighs. Soft knee bend (15°).',
        jointAlignment: 'Shoulders retracted • Neutral spine • Gaze fixed 6 feet ahead',
        motionDirection: 'Inhale & Push Hips Back ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Hinge',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Push hips backward toward the wall behind you. Slide dumbbells down close along thighs.',
        jointAlignment: 'Shins remain vertical • Knees stay soft but stationary • Flat back',
        motionDirection: 'Hips Driven Back ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Lowest Position (Mid-Shin)',
        imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Weights reach mid-shin with maximum hamstring stretch. Torso is at a 45° angle.',
        jointAlignment: 'Flat neutral spine • Zero lumbar rounding • Hamstrings under full load',
        motionDirection: 'Drive Hips Forward ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return to Stand',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Drive hips forward, stand tall, and squeeze glutes firmly at top lockout.',
        jointAlignment: 'Vertical posture • No backward hyperextension • Glutes contracted',
        motionDirection: 'Exhale & Squeeze Glutes'
      }
    ]
  },
  {
    id: 'ex-guide-glute-bridge',
    name: 'Glute Bridges (with Mini-Band)',
    category: 'Core & Posture',
    purpose: 'Awakens dormant gluteal muscles caused by prolonged desk sitting, stabilizing the sacroiliac joint, relieving lower back tension, and sculpting lower-body tone.',
    targetMuscles: ['Gluteus Maximus', 'Gluteus Medius', 'Hamstrings', 'Transverse Abdominis'],
    primaryMover: 'Gluteus Maximus',
    secondaryStabilizers: ['Hamstrings', 'Erector Spinae', 'Abdominal Wall'],
    startingPosition: 'Lie flat on your back on an exercise mat with knees bent at 90°, feet flat on floor hip-width apart, and arms at your sides with palms down.',
    correctForm: 'Maintain a flat lower back at the start. Avoid hyperextending the lumbar spine at the peak. Press knees gently outward against the mini-band to activate gluteus medius.',
    stepByStepInstructions: [
      '**1. Starting Position**: Lie supine on mat, bend knees 90°, feet flat on floor hip-width apart, arms resting at sides.',
      '**2. Movement Into Exercise (Heel Drive)**: Inhale to brace core, then exhale and push firmly through your heels to raise hips off the mat.',
      '**3. Lowest/Peak Position (Glute Lockout)**: Lift until thighs and torso form a straight diagonal line. Squeeze glutes intensely for 2 full seconds.',
      '**4. Return to Starting Position**: Inhale and lower your hips back to the floor with control over 3 seconds.'
    ],
    breathingGuidance: 'Inhale on the floor; exhale forcefully as hips elevate and glutes contract; inhale as you lower.',
    tempoGuidance: '2-2-3-1 Tempo: 2 seconds up, 2 seconds peak squeeze, 3 seconds lowering down.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '15 reps',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between sets.',
    commonMistakes: [
      'Hyperextending lower back at top instead of squeezing glutes',
      'Pushing off toes instead of heels',
      'Letting knees cave inward during the lift'
    ],
    safetyTips: [
      'Place hands on lower abdomen to confirm core engagement',
      'Keep chin slightly tucked to prevent neck strain'
    ],
    modifications: 'Beginner: Bodyweight bridge without band; Advanced: Single-leg elevated glute bridge.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Lie flat on back with knees bent 90°, feet hip-width apart on mat, arms at sides.',
        jointAlignment: 'Lower back flat on mat • Feet flat • Neck relaxed',
        motionDirection: 'Inhale & Brace Core ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Lift',
        imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Drive through heels and push knees slightly outward against mini-band resistance.',
        jointAlignment: 'Knees aligned with feet • Core engaged • Hips ascending',
        motionDirection: 'Heel Drive Upward ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Peak Glute Bridge Lockout',
        imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Lift until knees, hips, and shoulders form a straight diagonal line. Squeeze glutes for 2s.',
        jointAlignment: 'Straight diagonal alignment • Zero lumbar hyperextension • Glutes hard',
        motionDirection: 'Hold Squeeze 2s ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return to Mat',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Lower hips back to the mat with control over 3 seconds before the next repetition.',
        jointAlignment: 'Controlled eccentric return • Reset core tension for next rep',
        motionDirection: 'Controlled 3s Descent'
      }
    ]
  },
  {
    id: 'ex-guide-plank',
    name: 'Forearm Plank Hold & 360° Core Cylinder',
    category: 'Core & Posture',
    purpose: 'Builds 360-degree abdominal cylinder endurance, strengthening deep transverse abdominis to flatten visceral belly protrusion, protect spinal discs, and stabilize pelvis.',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Serratus Anterior'],
    primaryMover: 'Transverse Abdominis & Rectus Abdominis',
    secondaryStabilizers: ['Shoulder Deltoids', 'Gluteus Medius', 'Quadriceps'],
    startingPosition: 'Rest forearms on mat directly under shoulders, elbows bent at 90°, legs extended straight back with toes tucked onto floor.',
    correctForm: 'Body must form a rigid straight line from heels to head. Glutes and quads squeezed tightly. Do not let lower back sag or hips pike upward.',
    stepByStepInstructions: [
      '**1. Starting Position**: Place forearms parallel to each other on mat with elbows directly under shoulders.',
      '**2. Movement Into Exercise (Step Back)**: Step legs back, tuck pelvis slightly (posterior tilt), squeeze glutes, and lift knees.',
      '**3. Lowest/Hold Position (Rigid Cylinder)**: Hold a rigid straight line from heels through hips to shoulders with calm diaphragmatic breathing.',
      '**4. Return to Starting Position**: Lower knees to mat with control once target duration is achieved and rest in child\'s pose.'
    ],
    breathingGuidance: 'Rhythmic 3-second inhale through nose, 3-second steady exhale through mouth without releasing core tension.',
    tempoGuidance: 'Continuous isometric hold for 35 to 45 seconds.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '35 - 45 seconds hold',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between holds. Relax in child\'s pose.',
    commonMistakes: [
      'Sagging lower back, placing shearing strain on lumbar vertebrae',
      'Piking hips too high in the air, removing tension from core',
      'Holding breath, which causes acute blood pressure spikes'
    ],
    safetyTips: [
      'If lower back aches, drop to knees for an inclined knee plank'
    ],
    modifications: 'Beginner: Incline Desk Plank or Knee Plank; Advanced: Plank with alternating shoulder taps.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Kneel on mat and place forearms flat, parallel to each other with elbows under shoulders.',
        jointAlignment: 'Elbows 90° directly under shoulders • Palms flat on mat',
        motionDirection: 'Position Forearms ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Plank',
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Extend legs back onto toes, engage glutes, and tuck pelvis into posterior pelvic tilt.',
        jointAlignment: 'Tuck pelvis slightly • Squeeze glutes and quadriceps',
        motionDirection: 'Lift Knees & Lock Core ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Rigid Plank Alignment',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Maintain straight rigid line from heels through hips to head. Breathe rhythmically for 40s.',
        jointAlignment: 'Shoulder blades broad • Neutral neck looking down • Core cylinder braced',
        motionDirection: 'Hold 35-45s with Steady Breath ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return & Rest',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Carefully lower knees back to the mat and rest in child\'s pose for 45 seconds.',
        jointAlignment: 'Gently decompress spine • Recover diaphragmatic breathing',
        motionDirection: 'Knees to Mat & 45s Rest'
      }
    ]
  },
  {
    id: 'ex-guide-bird-dog',
    name: 'Bird-Dog Core Stability & Spinal Balance',
    category: 'Core & Posture',
    purpose: 'Rehabilitation-grade spinal stabilization that strengthens multifidus, erector spinae, and deep core musculature with zero compressive load on intervertebral discs.',
    targetMuscles: ['Multifidus', 'Erector Spinae', 'Gluteus Maximus', 'Anterior Deltoids'],
    primaryMover: 'Multifidus & Gluteus Maximus',
    secondaryStabilizers: ['Transverse Abdominis', 'Shoulder Girdle', 'Obliques'],
    startingPosition: 'Tabletop position on hands and knees. Hands positioned directly below shoulders, knees directly below hips, spine in neutral alignment.',
    correctForm: 'Gaze stays fixed straight down at the mat. Hips remain completely level with zero sideways rotation or lower back arching.',
    stepByStepInstructions: [
      '**1. Starting Position**: Tabletop position on hands and knees with flat back, hands under shoulders, knees under hips.',
      '**2. Movement Into Extension**: Inhale, then as you exhale, simultaneously reach your right arm forward and left leg backward.',
      '**3. Lowest/Full Extension**: Extend until arm, torso, and leg form a single horizontal line parallel to the floor. Hold for 2 seconds.',
      '**4. Return to Starting Position**: Inhale and smoothly return hand and knee to tabletop before alternating sides.'
    ],
    breathingGuidance: 'Exhale as limbs reach straight out; inhale as limbs return to center.',
    tempoGuidance: '2-2-2 Tempo: 2s reach, 2s isometric hold, 2s return.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 reps per side',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between sets.',
    commonMistakes: [
      'Lifting leg too high, causing lower back to hyperextend',
      'Tilting hips sideways to compensate for core weakness'
    ],
    safetyTips: ['Focus on reaching long rather than kicking high.'],
    modifications: 'Beginner: Extend only leg while keeping both hands on mat.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Tabletop position on hands and knees on mat. Hands under shoulders, knees under hips.',
        jointAlignment: 'Spine neutral • Gaze down at mat • Core braced',
        motionDirection: 'Inhale & Prepare ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Extension',
        imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Exhale and simultaneously reach right arm forward and left leg straight back.',
        jointAlignment: 'Keep hips square to floor • Avoid sideways pelvis tilt',
        motionDirection: 'Reach Opposite Limbs ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Parallel Extension Lock',
        imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Hold horizontal parallel line from fingertips through spine to heel for 2 full seconds.',
        jointAlignment: 'Arm and leg parallel to floor • Multifidus and glute engaged',
        motionDirection: 'Hold Parallel 2s ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return to Center',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Inhale and slowly lower hand and knee back to tabletop, then repeat on opposite side.',
        jointAlignment: 'Reset neutral spine • Alternate smoothly to left arm / right leg',
        motionDirection: 'Inhale & Alternate Sides'
      }
    ]
  },
  {
    id: 'ex-guide-rows',
    name: 'Resistance Band Rows (Desk Posture Reset)',
    category: 'Strength & Tone',
    purpose: 'Reverses rounded-shoulder desk slouch, strengthens rhomboids and middle trapezius, and opens thoracic chest cavity for improved breathing.',
    targetMuscles: ['Rhomboids', 'Latissimus Dorsi', 'Middle Trapezius', 'Rear Deltoids'],
    primaryMover: 'Rhomboids & Latissimus Dorsi',
    secondaryStabilizers: ['Biceps', 'Erector Spinae', 'Rotator Cuff'],
    startingPosition: 'Sit tall on floor with legs extended, loop resistance band around midfoot and grasp both ends with arms straight.',
    correctForm: 'Sit tall with chest proud. Initiate movement by pinching shoulder blades together, driving elbows backward close to ribs.',
    stepByStepInstructions: [
      '**1. Starting Position**: Sit tall on mat with legs straight, band looped securely around midfoot, arms extended.',
      '**2. Movement Into Row**: Inhale, pull shoulders back and down, and initiate pull by pinching shoulder blades together.',
      '**3. Lowest/Peak Contraction**: Exhale and pull elbows back close to ribcage, contracting upper back muscles for 2 seconds.',
      '**4. Return to Starting Position**: Inhale and slowly let your arms extend forward over 3 seconds under control.'
    ],
    breathingGuidance: 'Exhale on the pull; inhale with control on the release.',
    tempoGuidance: '2-2-3-1 Tempo.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '12 - 15 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Rest 60 seconds between sets.',
    commonMistakes: [
      'Shrugging shoulders up to ears',
      'Leaning torso backward excessively'
    ],
    safetyTips: ['Keep wrists neutral throughout the pull.'],
    modifications: 'Can be performed standing with band attached to door anchor.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Sit tall on mat with legs extended, band securely looped around feet, arms straight.',
        jointAlignment: 'Chest lifted tall • Shoulders down away from ears • Arms extended',
        motionDirection: 'Inhale & Prepare Pull ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Row',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Initiate row by retracting shoulder blades and driving elbows backward past ribcage.',
        jointAlignment: 'Elbows tucked close to torso • Torso stays upright without rocking',
        motionDirection: 'Drive Elbows Back ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Peak Scapular Pinch',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Squeeze upper back blades tightly together at maximum pull for 2 full seconds.',
        jointAlignment: 'Maximum rhomboid contraction • Wrists straight • Chest proud',
        motionDirection: 'Hold Squeeze 2s ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Controlled Release',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Inhale and slowly let arms extend forward over 3 seconds under smooth band tension.',
        jointAlignment: 'Controlled eccentric return • Maintain upright posture',
        motionDirection: 'Controlled 3s Release'
      }
    ]
  },
  {
    id: 'ex-guide-incline-pushup',
    name: 'Incline Push-Ups (Bench / Countertop)',
    category: 'Strength & Tone',
    purpose: 'Builds upper-body pushing power, pectoral strength, and anterior shoulder tone while remaining joint-friendly for wrists and shoulders.',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps', 'Core'],
    primaryMover: 'Pectoralis Major & Triceps',
    secondaryStabilizers: ['Anterior Deltoids', 'Core Cylinder', 'Serratus Anterior'],
    startingPosition: 'Place hands shoulder-width on a sturdy bench, countertop, or wall. Step feet back into an incline plank.',
    correctForm: 'Body forms a straight line from heels to head. Elbows track back at a 45-degree angle (arrow shape), never flaring out into a T.',
    stepByStepInstructions: [
      '**1. Starting Position**: Place hands shoulder-width on elevated bench, body in straight diagonal plank.',
      '**2. Movement Into Push-Up**: Inhale and lower chest toward surface over 2-3 seconds with elbows tucked at 45°.',
      '**3. Lowest Position (Chest Depth)**: Lower until chest is 2 inches from surface without sagging hips.',
      '**4. Return to Starting Position**: Exhale forcefully and press through palms to return to top plank.'
    ],
    breathingGuidance: 'Inhale on the descent; exhale forcefully as you push away.',
    tempoGuidance: '3-1-1 Tempo.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 - 12 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Rest 60 seconds between sets.',
    commonMistakes: ['Flaring elbows out to 90 degrees', 'Sagging hips.'],
    safetyTips: ['Use higher incline (wall) if wrist discomfort occurs.'],
    modifications: 'Beginner: Wall Push-Ups; Advanced: Floor Knee Push-Ups.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Starting Position',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Place hands shoulder-width on sturdy bench or countertop. Form straight diagonal plank.',
        jointAlignment: 'Body straight from heels to head • Core cylinder engaged',
        motionDirection: 'Inhale & Prepare Descent ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Movement Into Descent',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Lower chest toward bench over 2-3 seconds, tucking elbows back at 45° angle.',
        jointAlignment: 'Elbows at 45° arrow shape • No flaring out • Hips rigid',
        motionDirection: '3s Controlled Lowering ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Lowest Position (2" Depth)',
        imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Chest lowers within 2 inches of surface with peak stretch across pectorals.',
        jointAlignment: 'Maximum chest tension • Spine perfectly aligned • Zero hip sag',
        motionDirection: 'Press Through Palms ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Return to Top Plank',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Exhale forcefully and push through palms to return to top plank position.',
        jointAlignment: 'Arms fully extended • Core tight • Ready for next rep',
        motionDirection: 'Exhale & Lockout'
      }
    ]
  },
  {
    id: 'ex-guide-cat-cow',
    name: 'Cat-Cow Spinal Mobility & Diaphragmatic Breath',
    category: 'Mobility & Joint Health',
    purpose: 'Stimulates vagus nerve activity to lower cortisol levels, mobilizes thoracic vertebrae, and relieves lumbar stiffness.',
    targetMuscles: ['Spinal Extensors', 'Rectus Abdominis', 'Diaphragm', 'Pelvic Floor'],
    primaryMover: 'Spinal Articulation & Diaphragm',
    secondaryStabilizers: ['Core Cylinder', 'Serratus Anterior'],
    startingPosition: 'Tabletop position on hands and knees on an exercise mat.',
    correctForm: 'Wrists directly under shoulders, knees under hips. Flow gently with the natural cadence of your breath.',
    stepByStepInstructions: [
      '**1. Starting Position**: Tabletop position on hands and knees on mat with neutral spine.',
      '**2. Cow Phase (Inhale & Arch)**: Inhale slowly through nose, drop belly gently toward mat, lift chest and gaze upward.',
      '**3. Cat Phase (Exhale & Round)**: Exhale fully through mouth, round spine upward toward ceiling, tuck chin to chest and draw navel in.',
      '**4. Return & Repeat**: Flow smoothly between both phases for 8-10 complete breath cycles.'
    ],
    breathingGuidance: 'Deep 4-second inhale on Cow; complete 4-second exhale on Cat.',
    tempoGuidance: '4s Inhale / 4s Exhale smooth wave.',
    recommendedDose: {
      sets: 2,
      repsOrDuration: '8 - 10 slow breath cycles',
      restBetweenSets: '30 seconds'
    },
    restAndRecovery: 'Rest 30 seconds. Feel the parasympathetic relaxation in your nervous system.',
    commonMistakes: ['Rushing through breath cycles', 'Forcing neck into sharp extension.'],
    safetyTips: ['Move gently within a pain-free range of motion.'],
    modifications: 'Can be performed seated on a chair during desk breaks.',
    photoSequence: [
      {
        stepNumber: 1,
        stepTitle: '1. Neutral Tabletop',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Start on hands and knees with flat back, hands under shoulders, knees under hips.',
        jointAlignment: 'Wrists under shoulders • Knees under hips • Spine neutral',
        motionDirection: 'Inhale & Transition to Cow ➔'
      },
      {
        stepNumber: 2,
        stepTitle: '2. Cow Pose (Inhale & Arch)',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Inhale deeply through nose, drop belly gently toward mat, lift chest and gaze up.',
        jointAlignment: 'Gentle spinal extension • Abdominal wall stretches • Shoulders back',
        motionDirection: '4s Smooth Inhale ➔'
      },
      {
        stepNumber: 3,
        stepTitle: '3. Cat Pose (Exhale & Round)',
        imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Exhale fully through mouth, round spine toward ceiling, tuck chin, draw navel in.',
        jointAlignment: 'Thoracic flexion • Neck relaxed down • Abdominal wall engaged',
        motionDirection: '4s Complete Exhale ➔'
      },
      {
        stepNumber: 4,
        stepTitle: '4. Flow Wave Repeat',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
        postureCue: 'Continue flowing seamlessly between Cow and Cat with rhythmic breath waves.',
        jointAlignment: 'Fluid continuous articulation • Vagus nerve activation',
        motionDirection: '8-10 Wave Cycles'
      }
    ]
  }
];
