export interface ExerciseDetailItem {
  id: string;
  name: string;
  category: 'Strength & Tone' | 'Core & Posture' | 'Cardio & Metabolic' | 'Mobility & Joint Health';
  purpose: string;
  targetMuscles: string[];
  startingPosition: string;
  correctForm: string;
  stepByStepInstructions: string[];
  breathingGuidance: string;
  recommendedDose: {
    sets: number;
    repsOrDuration: string;
    restBetweenSets: string;
  };
  restAndRecovery: string;
  commonMistakes: string[];
  safetyTips: string[];
  modifications?: string;
  diagramSvg?: string;
}

export const EXERCISE_GUIDE_CATALOG: ExerciseDetailItem[] = [
  {
    id: 'ex-guide-squat',
    name: 'Bodyweight Goblet Squat',
    category: 'Strength & Tone',
    purpose: 'Activates large lower-body muscle groups (quads, glutes) to rapidly enhance postprandial glucose uptake and stimulate fat oxidation.',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core Stabilizers'],
    startingPosition: 'Stand tall with feet shoulder-width apart, toes pointing slightly outward (10-15°). Hold hands together at chest height or hold a light dumbbell close to your sternum.',
    correctForm: 'Keep chest lifted high, shoulders down and back, core braced, and distribute bodyweight evenly through midfoot and heels. Knees must track directly over toes.',
    stepByStepInstructions: [
      'Inhale deeply and brace your core as if preparing to take a punch.',
      'Initiate movement by pushing hips slightly back while simultaneously bending your knees.',
      'Lower hips with control over 3 seconds until thighs are parallel to the floor (or to a comfortable deep squat).',
      'Pause for 1 second at the bottom without relaxing or rounding your lower back.',
      'Exhale forcefully and drive straight up through your heels to return to the standing starting position.'
    ],
    breathingGuidance: 'Inhale through nose on the way down (eccentric phase); exhale forcefully through mouth as you drive up (concentric phase).',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '12 - 15 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Take 60 seconds rest between sets. Shake out legs and take light sips of room-temperature water.',
    commonMistakes: [
      'Allowing knees to cave inward (valgus collapse) during the upward push',
      'Lifting heels off the ground, placing excessive shear force on knee joints',
      'Rounding the lower back and pitching the chest excessively forward'
    ],
    safetyTips: [
      'If knee tightness occurs, limit depth to 90 degrees or use a sturdy chair for box squats',
      'Maintain an upright torso angle throughout the entire descent'
    ],
    modifications: 'Beginner: Perform Box Squats onto a chair or sofa. Advanced: Add a 3-second isometric pause at the bottom or use a 5kg dumbbell.',
    diagramSvg: `<svg viewBox="0 0 400 160" width="100%" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-squat" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>
      <!-- Background Ground Line -->
      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
      
      <!-- Phase 1: Standing Setup -->
      <g transform="translate(60, 10)">
        <text x="30" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f766e">1. START: Tall Setup</text>
        <circle cx="30" cy="35" r="9" fill="#0d9488" />
        <!-- Spine -->
        <line x1="30" y1="44" x2="30" y2="85" stroke="#0f766e" stroke-width="5" stroke-linecap="round" />
        <!-- Arms -->
        <path d="M 30 52 L 20 65 L 30 65" fill="none" stroke="#0f766e" stroke-width="3" stroke-linecap="round" />
        <!-- Legs -->
        <line x1="30" y1="85" x2="22" y2="138" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
        <line x1="30" y1="85" x2="38" y2="138" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
        <!-- Feet -->
        <line x1="16" y1="138" x2="25" y2="138" stroke="#0f766e" stroke-width="4" />
        <line x1="34" y1="138" x2="44" y2="138" stroke="#0f766e" stroke-width="4" />
      </g>

      <!-- Motion Arrow -->
      <path d="M 140 75 Q 190 60 230 75" fill="none" stroke="#0d9488" stroke-width="3" stroke-dasharray="4 4" marker-end="url(#arrow-squat)" />
      <text x="185" y="55" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d9488">Descent 3s</text>

      <!-- Phase 2: Parallel Squat Finish -->
      <g transform="translate(250, 10)">
        <text x="45" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#059669">2. FINISH: Parallel Depth</text>
        <circle cx="28" cy="55" r="9" fill="#059669" />
        <!-- Torso angled upright -->
        <line x1="28" y1="64" x2="15" y2="100" stroke="#059669" stroke-width="5" stroke-linecap="round" />
        <!-- Arms at chest -->
        <path d="M 28 72 L 38 80 L 28 80" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" />
        <!-- Thigh parallel to floor -->
        <line x1="15" y1="100" x2="52" y2="100" stroke="#10b981" stroke-width="6" stroke-linecap="round" />
        <!-- Shin vertical / slight forward -->
        <line x1="52" y1="100" x2="48" y2="138" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        <line x1="42" y1="138" x2="56" y2="138" stroke="#059669" stroke-width="4" />
        <!-- Quadriceps & Glutes Target Glow -->
        <circle cx="34" cy="100" r="12" fill="#10b981" opacity="0.25" />
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-rdl',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Strength & Tone',
    purpose: 'Strengthens the posterior chain (glutes, hamstrings, spinal erectors) to reverse anterior pelvic tilt and optimize metabolic rate.',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Upper Back'],
    startingPosition: 'Stand tall holding light dumbbells or a resistance band against the front of thighs. Feet hip-width apart with a soft, unlocked bend in the knees.',
    correctForm: 'Maintain a flat, neutral spine with shoulder blades pinched back. The movement is a pure hip hinge: push hips backward rather than bending the knees.',
    stepByStepInstructions: [
      'Inhale, pull shoulders back and down, and keep your gaze 6 feet in front of you.',
      'Push your hips directly backward as if trying to touch a wall behind you with your glutes.',
      'Slide the dumbbells down closely along your thighs and shins until you feel a deep stretch in hamstrings.',
      'Stop when hips stop moving backward (usually just below knees). Do not let lower back round.',
      'Exhale, drive hips forward, and squeeze glutes firmly at the top lockout.'
    ],
    breathingGuidance: 'Inhale as you push hips back into the stretch; exhale as you drive hips forward to standing.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 - 12 reps',
      restBetweenSets: '75 seconds'
    },
    restAndRecovery: 'Rest 75 seconds between sets. Allow hamstrings to recover elasticity.',
    commonMistakes: [
      'Bending the knees excessively (turning the hip hinge into a squat)',
      'Allowing the dumbbells to drift away from the legs, overloading the lumbar spine',
      'Hyperextending and arching backward at the top of the movement'
    ],
    safetyTips: [
      'Never allow the lower back to round into a C-shape',
      'Keep the weights in light contact with your shins throughout the descent'
    ],
    modifications: 'Beginner: Practice bodyweight hip hinges with glutes touching a wall. Advanced: Single-leg Romanian deadlift.',
    diagramSvg: `<svg viewBox="0 0 400 160" width="100%" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-rdl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>
      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
      
      <!-- Phase 1: Standing -->
      <g transform="translate(60, 10)">
        <text x="30" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f766e">1. START: Tall & Neutral</text>
        <circle cx="30" cy="35" r="9" fill="#0d9488" />
        <line x1="30" y1="44" x2="30" y2="85" stroke="#0f766e" stroke-width="5" stroke-linecap="round" />
        <line x1="30" y1="52" x2="30" y2="80" stroke="#334155" stroke-width="3" />
        <rect x="25" y="78" width="10" height="6" rx="2" fill="#475569" />
        <line x1="30" y1="85" x2="30" y2="138" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
        <line x1="24" y1="138" x2="36" y2="138" stroke="#0f766e" stroke-width="4" />
      </g>

      <!-- Motion Arrow -->
      <path d="M 130 75 Q 185 55 230 75" fill="none" stroke="#0d9488" stroke-width="3" stroke-dasharray="4 4" marker-end="url(#arrow-rdl)" />
      <text x="180" y="50" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d9488">Hips Push Back</text>

      <!-- Phase 2: Hip Hinge -->
      <g transform="translate(240, 10)">
        <text x="60" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#059669">2. FINISH: 45° Hip Hinge</text>
        <circle cx="85" cy="55" r="9" fill="#059669" />
        <!-- Flat Back Torso -->
        <line x1="85" y1="62" x2="40" y2="88" stroke="#059669" stroke-width="5" stroke-linecap="round" />
        <!-- Dumbbells close to shins -->
        <line x1="75" y1="68" x2="70" y2="108" stroke="#334155" stroke-width="3" />
        <rect x="65" y="105" width="10" height="6" rx="2" fill="#475569" />
        <!-- Soft knees & hamstrings stretch -->
        <line x1="40" y1="88" x2="52" y2="112" stroke="#10b981" stroke-width="5" stroke-linecap="round" />
        <line x1="52" y1="112" x2="50" y2="138" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        <line x1="44" y1="138" x2="56" y2="138" stroke="#059669" stroke-width="4" />
        <!-- Hamstrings Target Zone -->
        <path d="M 40 88 L 52 112" stroke="#f59e0b" stroke-width="6" opacity="0.4" />
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-glute-bridge',
    name: 'Glute Bridges (with Mini-Band)',
    category: 'Core & Posture',
    purpose: 'Awakens dormant gluteal muscles caused by desk sitting, stabilizing the sacroiliac joint and sculpting lower-body muscle tone.',
    targetMuscles: ['Gluteus Maximus', 'Gluteus Medius', 'Hamstrings', 'Transverse Abdominis'],
    startingPosition: 'Lie flat on your back on an exercise mat with knees bent at 90°, feet flat on the floor hip-width apart, and arms at your sides with palms down.',
    correctForm: 'Maintain a flat lower back at the start. Avoid over-arching the lumbar spine at the peak. Press knees gently outward against the mini-band.',
    stepByStepInstructions: [
      'Inhale and brace core by gently drawing your navel toward your spine.',
      'Exhale and drive firmly through your heels to lift hips until thighs and torso form a straight diagonal line.',
      'Squeeze your glutes intensely at the top for 2 full seconds.',
      'Ensure knees stay pushed outward in line with your feet.',
      'Inhale and slowly lower your hips back to the floor with control over 3 seconds.'
    ],
    breathingGuidance: 'Inhale on the floor; exhale forcefully as hips elevate and glutes squeeze; inhale as you lower.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '15 reps',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between sets. Keep breathing steady and relaxed.',
    commonMistakes: [
      'Hyperextending the lower back at the peak instead of squeezing the glutes',
      'Pushing off the toes instead of the midfoot and heels',
      'Letting knees cave inward during the lift'
    ],
    safetyTips: [
      'Place hands on your lower abdomen to verify core engagement',
      'Keep your chin slightly tucked to prevent cervical spine arching'
    ],
    modifications: 'Beginner: Bodyweight bridge without band; Advanced: Single-leg elevated glute bridge.',
    diagramSvg: `<svg viewBox="0 0 400 160" width="100%" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-bridge" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>
      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
      
      <!-- Phase 1: Resting on Floor -->
      <g transform="translate(40, 20)">
        <text x="60" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f766e">1. START: Flat Back Setup</text>
        <circle cx="25" cy="115" r="8" fill="#0d9488" />
        <!-- Torso on ground -->
        <line x1="33" y1="117" x2="75" y2="117" stroke="#0f766e" stroke-width="5" stroke-linecap="round" />
        <!-- Knees bent -->
        <line x1="75" y1="117" x2="95" y2="85" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
        <line x1="95" y1="85" x2="105" y2="117" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
      </g>

      <!-- Motion Arrow -->
      <path d="M 160 85 Q 195 60 230 85" fill="none" stroke="#0d9488" stroke-width="3" stroke-dasharray="4 4" marker-end="url(#arrow-bridge)" />
      <text x="195" y="60" text-anchor="middle" font-size="9" font-weight="bold" fill="#0d9488">Drive Heels ➔ Lift Hips</text>

      <!-- Phase 2: Elevated Glute Bridge -->
      <g transform="translate(230, 20)">
        <text x="70" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#059669">2. FINISH: Straight Line & Glute Lockout</text>
        <circle cx="25" cy="115" r="8" fill="#059669" />
        <!-- Straight line torso to knees -->
        <line x1="33" y1="115" x2="85" y2="75" stroke="#10b981" stroke-width="6" stroke-linecap="round" />
        <!-- Shin vertical -->
        <line x1="85" y1="75" x2="100" y2="117" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        <!-- Glutes Target Highlight -->
        <circle cx="68" cy="88" r="10" fill="#f59e0b" opacity="0.35" />
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-plank',
    name: 'Forearm Plank Hold & Core Cylinder',
    category: 'Core & Posture',
    purpose: 'Builds 360-degree abdominal cylinder endurance, strengthening deep transverse abdominis to flatten visceral belly protrusion and protect spine.',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Shoulder Deltoids'],
    startingPosition: 'Rest forearms on mat directly under shoulders, elbows bent at 90°, legs extended straight back with toes tucked onto floor.',
    correctForm: 'Body must form a rigid straight line from heels to head. Glutes and quads squeezed tightly. Do not let lower back sag or hips pike upward.',
    stepByStepInstructions: [
      'Set forearms parallel to each other with palms flat on the mat.',
      'Engage glutes, tuck pelvis slightly (posterior tilt), and draw navel toward spine.',
      'Press forearms into floor to broaden shoulder blades across your ribcage.',
      'Maintain steady, calm breathing while holding the rigid cylinder position.',
      'Carefully lower knees to mat once target time is achieved.'
    ],
    breathingGuidance: 'Rhythmic diaphragmatic breathing: 3-second inhale through nose, 3-second steady exhale through mouth without releasing core tension.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '35 - 45 seconds hold',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between plank holds. Relax in child\'s pose if needed.',
    commonMistakes: [
      'Sagging lower back (hyperlordosis), which strains lumbar facet joints',
      'Piking hips too high in the air, removing tension from the abdominal wall',
      'Holding breath, which causes acute blood pressure spikes'
    ],
    safetyTips: [
      'If you feel lower back strain, immediately drop to knees for an inclined knee plank'
    ],
    modifications: 'Beginner: Incline Forearm Plank against desk or kitchen countertop; Advanced: Plank with alternating shoulder taps.',
    diagramSvg: `<svg viewBox="0 0 400 160" width="100%" height="140" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
      
      <g transform="translate(80, 25)">
        <text x="120" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">Rigid 360° Core Plank Alignment</text>
        
        <!-- Head -->
        <circle cx="215" cy="65" r="9" fill="#0d9488" />
        
        <!-- Forearms / Elbows under shoulders -->
        <line x1="195" y1="72" x2="195" y2="115" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        <line x1="195" y1="115" x2="225" y2="115" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        
        <!-- Straight Rigid Body Line -->
        <line x1="20" y1="110" x2="195" y2="72" stroke="#059669" stroke-width="6" stroke-linecap="round" />
        
        <!-- Toes on ground -->
        <line x1="20" y1="110" x2="15" y2="115" stroke="#334155" stroke-width="4" />
        
        <!-- Core Cylinder Indicator Ring -->
        <circle cx="115" cy="90" r="14" fill="#10b981" opacity="0.3" stroke="#059669" stroke-width="1.5" stroke-dasharray="3 3" />
        <text x="115" y="93" text-anchor="middle" font-size="8" font-weight="bold" fill="#065f46">Braced Core</text>
        
        <!-- Neutral Spine Line -->
        <line x1="20" y1="65" x2="210" y2="65" stroke="#0d9488" stroke-width="1" stroke-dasharray="2 2" />
        <text x="100" y="58" font-size="8" font-weight="bold" fill="#0f766e">Neutral Spine Axis</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-bird-dog',
    name: 'Bird-Dog Core Stability & Spinal Balance',
    category: 'Core & Posture',
    purpose: 'Clinically proven rehabilitation exercise that strengthens multifidus and deep spinal stabilizers without compressive loads on intervertebral discs.',
    targetMuscles: ['Multifidus', 'Erector Spinae', 'Gluteus Maximus', 'Anterior Deltoids'],
    startingPosition: 'Tabletop position on hands and knees. Hands positioned directly below shoulders, knees directly below hips, spine in neutral alignment.',
    correctForm: 'Gaze stays fixed straight down at the mat. Hips remain completely level with zero sideways rotation or lower back arching.',
    stepByStepInstructions: [
      'Find your neutral spine and brace your abdominal wall.',
      'Inhale, then as you exhale, simultaneously extend your right arm forward and left leg backward.',
      'Reach through your fingertips and heel until arm and leg are parallel to the floor.',
      'Hold the extended position for 2 seconds while maintaining level hips.',
      'Inhale and return smoothly to tabletop, then alternate to left arm and right leg.'
    ],
    breathingGuidance: 'Exhale as limbs reach straight out; inhale as limbs return to center.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 reps per side',
      restBetweenSets: '45 seconds'
    },
    restAndRecovery: 'Rest 45 seconds between sets. Move with slow, deliberate control.',
    commonMistakes: [
      'Lifting the leg too high, causing lower back to hyperextend',
      'Tilting hips sideways to compensate for core weakness'
    ],
    safetyTips: [
      'Focus on reaching long rather than kicking high'
    ],
    modifications: 'Beginner: Extend only leg while keeping both hands on mat.',
    diagramSvg: `<svg viewBox="0 0 400 160" width="100%" height="140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow-bd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>
      <line x1="20" y1="140" x2="380" y2="140" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4 4" />
      
      <g transform="translate(60, 20)">
        <text x="140" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#0f766e">Opposite Arm & Leg Parallel Extension</text>
        
        <!-- Head -->
        <circle cx="195" cy="65" r="8" fill="#0d9488" />
        
        <!-- Extended Arm -->
        <line x1="185" y1="70" x2="250" y2="70" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        
        <!-- Ground Arm -->
        <line x1="185" y1="70" x2="185" y2="117" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        
        <!-- Torso Line -->
        <line x1="185" y1="70" x2="105" y2="70" stroke="#059669" stroke-width="5" stroke-linecap="round" />
        
        <!-- Ground Knee -->
        <line x1="105" y1="70" x2="105" y2="117" stroke="#334155" stroke-width="4" stroke-linecap="round" />
        
        <!-- Extended Leg -->
        <line x1="105" y1="70" x2="35" y2="70" stroke="#059669" stroke-width="5" stroke-linecap="round" />
        
        <!-- Tension balance line -->
        <line x1="30" y1="70" x2="255" y2="70" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" />
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-rows',
    name: 'Resistance Band Rows (Desk Posture Reset)',
    category: 'Strength & Tone',
    purpose: 'Reverses rounded-shoulder desk slouch, strengthens rhomboids and middle trapezius, and improves breathing mechanics.',
    targetMuscles: ['Rhomboids', 'Latissimus Dorsi', 'Middle Trapezius', 'Rear Deltoids'],
    startingPosition: 'Sit tall on floor with legs extended, loop resistance band around midfoot and grasp both ends with arms straight.',
    correctForm: 'Sit tall with chest proud. Initiate movement by pinching shoulder blades together, driving elbows backward close to ribs.',
    stepByStepInstructions: [
      'Inhale and lengthen your spine.',
      'Exhale and pull band handles toward your navel, driving elbows backward.',
      'Squeeze your upper back blades together for 2 seconds at full contraction.',
      'Inhale and slowly let your arms extend forward over 3 seconds.'
    ],
    breathingGuidance: 'Exhale on the pull; inhale with control on the release.',
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
    modifications: 'Can be performed standing with band attached to door anchor.'
  },
  {
    id: 'ex-guide-incline-pushup',
    name: 'Incline Push-Ups (Desk / Wall)',
    category: 'Strength & Tone',
    purpose: 'Builds upper-body pushing power, pectoral strength, and anterior shoulder tone while remaining gentle on wrists and joints.',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps', 'Core'],
    startingPosition: 'Place hands shoulder-width on a sturdy table, countertop, or wall. Step feet back into an incline plank.',
    correctForm: 'Body forms a straight line from heels to head. Elbows track back at a 45-degree angle (arrow shape), never flaring out into a T.',
    stepByStepInstructions: [
      'Inhale and lower chest toward surface over 2-3 seconds until chest is 2 inches away.',
      'Maintain tight glutes and flat abdomen throughout.',
      'Exhale and push through palms to return to starting plank.'
    ],
    breathingGuidance: 'Inhale on the descent; exhale forcefully as you push away.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 - 12 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Rest 60 seconds between sets.',
    commonMistakes: ['Flaring elbows out to 90 degrees', 'Sagging hips.'],
    safetyTips: ['Use higher incline (wall) if wrist discomfort occurs.'],
    modifications: 'Beginner: Wall Push-Ups; Advanced: Floor Knee Push-Ups.'
  },
  {
    id: 'ex-guide-cat-cow',
    name: 'Cat-Cow Spinal Mobility & Diaphragmatic Breath',
    category: 'Mobility & Joint Health',
    purpose: 'Stimulates vagus nerve activity to lower cortisol levels, mobilizes thoracic vertebrae, and relieves lumbar stiffness.',
    targetMuscles: ['Spinal Extensors', 'Rectus Abdominis', 'Diaphragm', 'Pelvic Floor'],
    startingPosition: 'Tabletop position on hands and knees on an exercise mat.',
    correctForm: 'Wrists directly under shoulders, knees under hips. Flow gently with the natural cadence of your breath.',
    stepByStepInstructions: [
      '**Cow Phase**: Inhale slowly through nose, drop belly gently toward mat, lift chest and gaze toward ceiling.',
      'Feel gentle expansion across the front of the abdomen.',
      '**Cat Phase**: Exhale fully through mouth, round spine upward toward ceiling, tuck chin to chest and draw navel in.',
      'Flow smoothly between both phases for 8-10 complete breath cycles.'
    ],
    breathingGuidance: 'Deep 4-second inhale on Cow; complete 4-second exhale on Cat.',
    recommendedDose: {
      sets: 2,
      repsOrDuration: '8 - 10 slow breath cycles',
      restBetweenSets: '30 seconds'
    },
    restAndRecovery: 'Rest 30 seconds. Feel the parasympathetic relaxation in your nervous system.',
    commonMistakes: ['Rushing through breath cycles', 'Forcing neck into sharp extension.'],
    safetyTips: ['Move gently within a pain-free range of motion.'],
    modifications: 'Can be performed seated on a chair during desk breaks.'
  }
];
