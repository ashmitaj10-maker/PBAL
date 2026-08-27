export interface ExerciseSequenceFrame {
  phaseNumber: number;
  phaseTitle: string;
  keyCue: string;
  targetEngagement: string;
  postureCheckpoints: string[];
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
  sequenceFrames?: ExerciseSequenceFrame[];
  diagramSvg: string;
}

export const EXERCISE_GUIDE_CATALOG: ExerciseDetailItem[] = [
  {
    id: 'ex-guide-squat',
    name: 'Bodyweight Goblet Squat',
    category: 'Strength & Tone',
    purpose: 'Activates large lower-body muscle groups (quads, glutes, hamstrings) to rapidly enhance postprandial glucose uptake, boost metabolic rate, and improve hip mobility.',
    targetMuscles: ['Quadriceps (Vastus Lateralis/Medialis)', 'Gluteus Maximus', 'Hamstrings', 'Core Cylinder'],
    primaryMover: 'Quadriceps & Gluteus Maximus',
    secondaryStabilizers: ['Transverse Abdominis', 'Erector Spinae', 'Calves (Gastrocnemius)'],
    startingPosition: 'Stand upright with feet shoulder-width apart, toes turned slightly outward (10-15°). Hold hands together firmly at chest level (or cradle a dumbbell vertically). Keep chest tall and spine neutral.',
    correctForm: 'Distribute bodyweight evenly through your midfoot and heels. Keep your chest elevated at roughly 60-70 degrees and ensure both knees track outward directly in line with your second toe throughout the descent.',
    stepByStepInstructions: [
      '**Phase 1 (Setup)**: Stand tall, brace your abdominal wall tightly, and position your feet shoulder-width apart.',
      '**Phase 2 (Descent)**: Inhale deeply through your nose as you push your hips slightly back and bend your knees. Lower your body under control over 3 full seconds.',
      '**Phase 3 (Parallel Depth)**: Descend until your hip crease is parallel to or slightly below your kneecaps (90° knee angle). Keep your torso upright and heels firmly glued to the floor.',
      '**Phase 4 (Ascent Lockout)**: Exhale forcefully through pursed lips, drive straight down through your midfoot and heels, and extend hips to stand tall, squeezing glutes at the top.'
    ],
    breathingGuidance: 'Inhale deeply through your nose as you lower into the squat (eccentric phase); exhale forcefully through your mouth as you push upward to standing (concentric phase).',
    tempoGuidance: '3-1-1-1 Tempo: 3 seconds down, 1 second pause at parallel, 1 second drive up, 1 second glute squeeze.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '12 - 15 reps',
      restBetweenSets: '60 seconds'
    },
    restAndRecovery: 'Rest 60 seconds between sets. Walk around lightly and take small sips of water to maintain muscle hydration.',
    commonMistakes: [
      'Knees collapsing inward (valgus collapse) during the upward drive',
      'Lifting heels off the ground, transferring excessive strain to the patellar tendon',
      'Excessive forward torso lean and rounding the lower back'
    ],
    safetyTips: [
      'If you experience knee discomfort, stop at 90 degrees or squat onto a 18-inch chair/bench',
      'Keep your eyes looking forward and slightly downward (not up at the ceiling) to protect cervical spine'
    ],
    modifications: 'Beginner: Chair Box Squats (sit to stand). Advanced: 3-Second Isometric Pause at the bottom with a 5kg-10kg dumbbell.',
    sequenceFrames: [
      {
        phaseNumber: 1,
        phaseTitle: 'Phase 1: Athletic Tall Stance',
        keyCue: 'Feet shoulder-width apart, toes angled 10°, chest proud, arms clasped at sternum.',
        targetEngagement: 'Abdominals braced, glutes active, plumb line balanced over midfoot.',
        postureCheckpoints: ['Neutral spine alignment', 'Shoulders relaxed down and back', 'Weight centered over midfoot']
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Phase 2: Controlled 3-Second Descent',
        keyCue: 'Hips push back and down simultaneously. Knees track outward over toes.',
        targetEngagement: 'Eccentric loading of quadriceps and adductors. Core cylinder maintains torso angle.',
        postureCheckpoints: ['Knees tracking in line with toes', 'Torso angle remains 65° upright', 'Heels firmly planted']
      },
      {
        phaseNumber: 3,
        phaseTitle: 'Phase 3: 90° Parallel Depth & Drive',
        keyCue: 'Thighs parallel to ground. Drive through heels to ascend.',
        targetEngagement: 'Peak contraction of gluteus maximus, vastus medialis, and hamstrings.',
        postureCheckpoints: ['Hip crease level with top of knee', 'Flat lower back with zero butt-wink', 'Exhale on upward drive']
      }
    ],
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="muscleActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d9488" />
          <stop offset="100%" stop-color="#14b8a6" />
        </linearGradient>
        <marker id="motionArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <!-- Background Reference Floor -->
      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- ================= FRAME 1: STARTING STANCE ================= -->
      <g transform="translate(40, 20)">
        <rect x="0" y="0" width="180" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="12" y="10" width="156" height="24" rx="8" fill="#f1f5f9" />
        <text x="90" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. STARTING POSTURE</text>

        <!-- Model Shadow -->
        <ellipse cx="90" cy="210" rx="36" ry="6" fill="#cbd5e1" opacity="0.6" />

        <!-- Realistic Human Figure: Standing Tall -->
        <!-- Head & Neck -->
        <circle cx="90" cy="54" r="13" fill="url(#humanSkinGrad)" />
        <path d="M 87 66 L 93 66 L 93 72 L 87 72 Z" fill="url(#humanSkinGrad)" />
        
        <!-- Torso / Chest / Core -->
        <path d="M 76 72 C 76 72, 90 70, 104 72 C 108 85, 106 112, 102 126 C 96 128, 84 128, 78 126 C 74 112, 72 85, 76 72 Z" fill="url(#humanSkinGrad)" />
        <!-- Clapsed Arms at Chest -->
        <path d="M 76 75 C 68 85, 68 96, 82 98 C 88 98, 92 94, 90 90 C 86 86, 80 84, 76 75 Z" fill="#334155" />
        <path d="M 104 75 C 112 85, 112 96, 98 98 C 92 98, 88 94, 90 90 C 94 86, 100 84, 104 75 Z" fill="#334155" />
        <!-- Dumbbell held at chest -->
        <rect x="85" y="85" width="10" height="18" rx="2" fill="#0d9488" />

        <!-- Hips & Glutes -->
        <path d="M 78 126 C 84 130, 96 130, 102 126 C 104 136, 102 144, 100 148 C 94 150, 86 150, 80 148 C 78 144, 76 136, 78 126 Z" fill="url(#humanSkinGrad)" />

        <!-- Left Leg (Thigh, Knee, Calf, Foot) -->
        <path d="M 80 148 C 80 162, 78 178, 79 190 C 76 195, 75 204, 73 209 L 63 209 C 63 206, 73 194, 75 190 C 74 178, 75 162, 78 148 Z" fill="url(#humanSkinGrad)" />
        <!-- Right Leg (Thigh, Knee, Calf, Foot) -->
        <path d="M 100 148 C 100 162, 102 178, 101 190 C 104 195, 105 204, 107 209 L 117 209 C 117 206, 107 194, 105 190 C 106 178, 105 162, 102 148 Z" fill="url(#humanSkinGrad)" />

        <!-- Alignment Plumb Line -->
        <line x1="90" y1="44" x2="90" y2="208" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.8" />
        <text x="90" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Shoulder-width stance</text>
      </g>

      <!-- Motion Flow Arrow 1 -> 2 -->
      <g transform="translate(230, 100)">
        <path d="M 0 20 C 15 5, 30 5, 45 20" fill="none" stroke="#0d9488" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#motionArrow)" />
        <text x="22" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#0f766e">3s Descent</text>
      </g>

      <!-- ================= FRAME 2: MID-DESCENT ================= -->
      <g transform="translate(285, 20)">
        <rect x="0" y="0" width="185" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="12" y="10" width="161" height="24" rx="8" fill="#f1f5f9" />
        <text x="92" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">2. CONTROLLED DESCENT</text>

        <ellipse cx="90" cy="210" rx="42" ry="6" fill="#cbd5e1" opacity="0.6" />

        <!-- Human Figure: 45° Incline Descent -->
        <circle cx="84" cy="74" r="13" fill="url(#humanSkinGrad)" />
        
        <!-- Angled Torso -->
        <path d="M 72 88 C 76 86, 92 84, 98 90 C 95 106, 88 128, 78 145 C 72 144, 62 140, 58 136 C 64 120, 68 100, 72 88 Z" fill="url(#humanSkinGrad)" />
        
        <!-- Arms with Dumbbell -->
        <path d="M 78 94 C 84 104, 94 104, 90 114 C 84 116, 76 112, 74 102 Z" fill="#334155" />
        <rect x="82" y="102" width="10" height="18" rx="2" fill="#0d9488" />

        <!-- Hips Back Arrow Indicator -->
        <path d="M 64 130 C 50 128, 42 134, 38 140" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#motionArrow)" />
        <text x="40" y="124" font-size="8" font-weight="bold" fill="#d97706">Hips Back</text>

        <!-- Bent Thighs & Knees Tracking Forward-Outward -->
        <!-- Left Leg -->
        <path d="M 66 142 C 84 148, 102 152, 108 160 C 104 176, 92 194, 76 209 L 64 209 C 78 194, 90 176, 94 160 C 88 155, 74 150, 62 144 Z" fill="url(#muscleActiveGrad)" />
        <!-- Right Leg Background -->
        <path d="M 74 142 C 92 148, 110 152, 116 160 C 112 176, 100 194, 94 209 L 106 209 C 112 194, 122 176, 120 160 C 114 155, 100 150, 76 144 Z" fill="#1e293b" opacity="0.7" />

        <text x="92" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Knees tracking over toes</text>
      </g>

      <!-- Motion Flow Arrow 2 -> 3 -->
      <g transform="translate(480, 100)">
        <path d="M 0 20 C 15 5, 30 5, 45 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#motionArrow)" />
        <text x="22" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">Hit Parallel</text>
      </g>

      <!-- ================= FRAME 3: PARALLEL DEPTH ================= -->
      <g transform="translate(535, 20)">
        <rect x="0" y="0" width="190" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="12" y="10" width="166" height="24" rx="8" fill="#d1fae5" />
        <text x="95" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">3. 90° PARALLEL DEPTH</text>

        <ellipse cx="95" cy="210" rx="46" ry="6" fill="#a7f3d0" opacity="0.8" />

        <!-- Deep Squat Human Model -->
        <!-- Head & Neck -->
        <circle cx="78" cy="98" r="13" fill="url(#humanSkinGrad)" />
        
        <!-- Torso Angled Solidly at 65° -->
        <path d="M 68 110 C 72 108, 88 106, 94 112 C 90 128, 76 150, 58 165 C 50 162, 40 158, 38 152 C 48 138, 62 120, 68 110 Z" fill="url(#humanSkinGrad)" />
        
        <!-- Arms Clapsed / Dumbbell -->
        <path d="M 74 116 C 80 126, 90 126, 86 136 C 80 138, 72 134, 70 124 Z" fill="#334155" />
        <rect x="78" y="124" width="10" height="18" rx="2" fill="#0d9488" />

        <!-- Thigh Perfectly Parallel to Ground (Highlighted Green Muscle Contraction) -->
        <path d="M 44 162 C 65 160, 95 160, 118 162 C 122 174, 114 184, 108 190 C 88 188, 65 186, 44 176 Z" fill="url(#muscleActiveGrad)" stroke="#047857" stroke-width="1.5" />
        
        <!-- Shin & Foot -->
        <path d="M 116 162 C 118 175, 114 195, 108 209 L 92 209 C 96 195, 104 175, 108 162 Z" fill="url(#humanSkinGrad)" />
        
        <!-- Background Leg -->
        <path d="M 126 164 C 128 175, 124 195, 118 209 L 128 209 C 134 195, 136 175, 126 164 Z" fill="#1e293b" opacity="0.6" />

        <!-- 90° Knee Angle Guide Arc -->
        <path d="M 108 150 A 15 15 0 0 1 122 172" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2 2" />
        <text x="135" y="162" font-size="9" font-weight="black" fill="#b45309">90°</text>

        <!-- Muscle Highlight Badges -->
        <rect x="42" y="195" width="58" height="15" rx="4" fill="#059669" />
        <text x="71" y="206" text-anchor="middle" font-size="8" font-weight="black" fill="#ffffff">QUADS & GLUTES</text>

        <text x="95" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Drive through heels to stand</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-rdl',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Strength & Tone',
    purpose: 'Strengthens the posterior chain (glutes, hamstrings, spinal erectors) to reverse anterior pelvic tilt and optimize metabolic rate.',
    targetMuscles: ['Hamstrings (Biceps Femoris/Semitendinosus)', 'Gluteus Maximus', 'Erector Spinae', 'Latissimus Dorsi'],
    primaryMover: 'Hamstrings & Gluteus Maximus',
    secondaryStabilizers: ['Lower Back (Erector Spinae)', 'Rhomboids', 'Forearm Grip'],
    startingPosition: 'Stand tall with feet hip-width apart holding dumbbells in front of your thighs. Shoulders are pulled back and down with knees soft and slightly unlocked (15°).',
    correctForm: 'Keep spine perfectly flat and neutral. The movement is a horizontal hip hinge: push your hips straight backward toward the wall behind you while sliding the weights down along your shins.',
    stepByStepInstructions: [
      '**Phase 1 (Hinge Stance)**: Stand tall, retract shoulder blades, unlock knees slightly, and gaze 6 feet ahead.',
      '**Phase 2 (Hip Push Back)**: Inhale and initiate movement purely from hips pushing backward. Keep weights brushing your shins.',
      '**Phase 3 (Mid-Shin Stretch)**: Lower until dumbbells reach mid-shin and you feel a deep hamstring stretch. Keep back flat.',
      '**Phase 4 (Glute Drive Lockout)**: Exhale, drive hips forward, and contract glutes firmly at top standing lockout.'
    ],
    breathingGuidance: 'Inhale as your hips travel backward into the hamstring stretch; exhale forcefully as you drive hips forward to standing.',
    tempoGuidance: '3-1-1-1 Tempo: 3 seconds lowering down, 1 second hold at stretch, 1 second forward drive.',
    recommendedDose: {
      sets: 3,
      repsOrDuration: '10 - 12 reps',
      restBetweenSets: '75 seconds'
    },
    restAndRecovery: 'Rest 75 seconds between sets. Allow posterior chain elastic recovery.',
    commonMistakes: [
      'Bending knees excessively into a squat instead of hinging hips back',
      'Letting weights drift away from the shins, causing lumbar shear strain',
      'Rounding the upper or lower spine at the bottom of the movement'
    ],
    safetyTips: [
      'Never allow the lower back to round into a C-shape',
      'Keep dumbbells in light contact with your legs throughout the entire descent'
    ],
    modifications: 'Beginner: Bodyweight wall-touch hip hinges. Advanced: Single-leg Romanian deadlift.',
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="rdlArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- FRAME 1: Tall Setup -->
      <g transform="translate(60, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#f1f5f9" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. START: Tall Neutral Hinge Setup</text>

        <ellipse cx="130" cy="210" rx="36" ry="6" fill="#cbd5e1" opacity="0.6" />

        <!-- Human Model Standing with Dumbbells -->
        <circle cx="130" cy="54" r="13" fill="#1e293b" />
        <path d="M 118 72 C 118 72, 130 70, 142 72 C 146 88, 144 114, 140 126 C 134 128, 126 128, 120 126 C 116 114, 114 88, 118 72 Z" fill="#1e293b" />
        <!-- Arms holding dumbbells at thighs -->
        <path d="M 120 76 L 116 115" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        <path d="M 140 76 L 144 115" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        <rect x="110" y="112" width="12" height="18" rx="3" fill="#0d9488" />
        <rect x="138" y="112" width="12" height="18" rx="3" fill="#0d9488" />

        <!-- Legs with soft knees -->
        <path d="M 120 126 C 122 148, 120 178, 118 209 L 108 209 C 110 178, 112 148, 120 126 Z" fill="#1e293b" />
        <path d="M 140 126 C 138 148, 140 178, 142 209 L 152 209 C 150 178, 148 148, 140 126 Z" fill="#1e293b" />

        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Shoulders back • Soft knees (15°)</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(340, 100)">
        <path d="M 0 20 C 25 5, 55 5, 80 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#rdlArrow)" />
        <text x="40" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">Hips Push Back ➔ Shins</text>
      </g>

      <!-- FRAME 2: 45° Hip Hinge with Hamstring Stretch -->
      <g transform="translate(440, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#d1fae5" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">2. 45° HIP HINGE & HAMSTRING LOAD</text>

        <ellipse cx="130" cy="210" rx="48" ry="6" fill="#a7f3d0" opacity="0.8" />

        <!-- Human Model Hinged at Hips -->
        <circle cx="185" cy="85" r="13" fill="#1e293b" />
        
        <!-- Flat Neutral Back Spine Line (45° angle) -->
        <path d="M 175 96 C 160 108, 135 120, 105 130 C 98 126, 92 118, 98 112 C 122 104, 150 94, 175 96 Z" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
        
        <!-- Arms Hanging Straight Down (Weights Brushing Shins) -->
        <path d="M 160 102 L 155 168" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        <rect x="148" y="165" width="14" height="20" rx="3" fill="#0d9488" />

        <!-- Hips Back Position & Hamstring Stretch Highlight -->
        <path d="M 105 130 C 114 150, 120 175, 124 209 L 112 209 C 104 175, 96 150, 105 130 Z" fill="url(#muscleActiveGrad)" stroke="#047857" stroke-width="1.5" />
        <path d="M 100 130 C 118 152, 130 178, 136 209 L 146 209 C 140 178, 126 152, 100 130 Z" fill="#1e293b" opacity="0.5" />

        <!-- Flat Spine Reference Line -->
        <line x1="88" y1="126" x2="195" y2="88" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 3" />
        <text x="145" y="80" text-anchor="middle" font-size="9" font-weight="black" fill="#b45309">FLAT NEUTRAL SPINE</text>

        <!-- Hamstring Tension Glow Badge -->
        <rect x="45" y="160" width="65" height="16" rx="4" fill="#059669" />
        <text x="77" y="172" text-anchor="middle" font-size="8" font-weight="black" fill="#ffffff">HAMSTRINGS</text>

        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Drive hips forward & squeeze glutes</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-glute-bridge',
    name: 'Glute Bridges (with Mini-Band)',
    category: 'Core & Posture',
    purpose: 'Awakens dormant gluteal muscles caused by desk sitting, stabilizing the sacroiliac joint, relieving lower back tension, and sculpting lower-body tone.',
    targetMuscles: ['Gluteus Maximus', 'Gluteus Medius', 'Hamstrings', 'Transverse Abdominis'],
    primaryMover: 'Gluteus Maximus',
    secondaryStabilizers: ['Hamstrings', 'Erector Spinae', 'Abdominal Wall'],
    startingPosition: 'Lie flat on your back on an exercise mat with knees bent at 90°, feet flat on floor hip-width apart, and arms at your sides with palms down.',
    correctForm: 'Maintain a flat lower back at the start. Avoid hyperextending the lumbar spine at the peak. Press knees gently outward against the mini-band to activate gluteus medius.',
    stepByStepInstructions: [
      '**Phase 1 (Setup)**: Lie supine, bend knees 90°, feet flat on floor hip-width apart, arms resting at sides.',
      '**Phase 2 (Heel Drive)**: Inhale to brace core, then exhale and push through your heels to raise hips off the mat.',
      '**Phase 3 (Peak Contraction)**: Lift until thighs and torso form a straight diagonal line. Squeeze glutes firmly for 2 full seconds.',
      '**Phase 4 (Controlled Lower)**: Inhale and lower your hips back to the floor with control over 3 seconds.'
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
      'Keep chin slightly tucked'
    ],
    modifications: 'Beginner: Bodyweight bridge without band; Advanced: Single-leg elevated glute bridge.',
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="bridgeArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- FRAME 1: Supine Starting Position -->
      <g transform="translate(60, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#f1f5f9" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. START: Flat Back Floor Setup</text>

        <!-- Model Supine -->
        <circle cx="50" cy="188" r="12" fill="#1e293b" />
        <!-- Torso Flat on Ground -->
        <path d="M 60 190 C 75 190, 110 190, 130 190 C 135 180, 130 175, 125 175 C 95 175, 75 175, 60 180 Z" fill="#1e293b" />
        <!-- Arms at side -->
        <line x1="68" y1="188" x2="110" y2="188" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        <!-- Bent Legs -->
        <path d="M 130 190 C 145 160, 160 145, 175 145 C 185 160, 195 180, 205 208 L 190 208 C 182 185, 175 165, 170 160 C 158 165, 145 180, 130 190 Z" fill="#1e293b" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Feet flat • Knees bent 90°</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(340, 100)">
        <path d="M 0 20 C 25 5, 55 5, 80 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#bridgeArrow)" />
        <text x="40" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">Heel Drive ➔ Lift Hips</text>
      </g>

      <!-- FRAME 2: Full Hip Extension -->
      <g transform="translate(440, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#d1fae5" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">2. PEAK GLUTE LOCKOUT (STRAIGHT LINE)</text>

        <circle cx="50" cy="188" r="12" fill="#1e293b" />
        
        <!-- Straight Diagonal Line from Shoulders to Knees -->
        <path d="M 60 188 C 85 170, 120 145, 155 130 C 162 138, 155 150, 145 158 C 115 172, 85 190, 60 196 Z" fill="url(#muscleActiveGrad)" stroke="#047857" stroke-width="1.5" />
        
        <!-- Glutes Peak Contraction Highlight -->
        <circle cx="138" cy="148" r="16" fill="#f59e0b" opacity="0.4" stroke="#d97706" stroke-width="2" stroke-dasharray="3 3" />
        <text x="138" y="152" text-anchor="middle" font-size="8" font-weight="black" fill="#92400e">GLUTES</text>

        <!-- Arms on ground for stability -->
        <line x1="68" y1="188" x2="115" y2="188" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        
        <!-- Shins Vertical to Floor -->
        <path d="M 155 130 C 168 150, 180 180, 190 208 L 175 208 C 168 180, 158 155, 150 140 Z" fill="#1e293b" />

        <!-- Alignment Guide -->
        <line x1="58" y1="188" x2="165" y2="126" stroke="#10b981" stroke-width="2" stroke-dasharray="3 3" />
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Hold peak squeeze for 2 seconds</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-plank',
    name: 'Forearm Plank Hold & Core Cylinder',
    category: 'Core & Posture',
    purpose: 'Builds 360-degree abdominal cylinder endurance, strengthening deep transverse abdominis to flatten visceral belly protrusion and protect spine.',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Serratus Anterior'],
    primaryMover: 'Transverse Abdominis & Rectus Abdominis',
    secondaryStabilizers: ['Shoulder Deltoids', 'Gluteus Medius', 'Quadriceps'],
    startingPosition: 'Rest forearms on mat directly under shoulders, elbows bent at 90°, legs extended straight back with toes tucked onto floor.',
    correctForm: 'Body must form a rigid straight line from heels to head. Glutes and quads squeezed tightly. Do not let lower back sag or hips pike upward.',
    stepByStepInstructions: [
      '**Phase 1 (Setup)**: Place forearms parallel to each other on mat with elbows under shoulders.',
      '**Phase 2 (Rigid Plank Alignment)**: Tuck pelvis slightly (posterior tilt), squeeze glutes, and lift knees to form a straight line.',
      '**Phase 3 (Core Cylinder Lock)**: Press forearms into floor to broaden upper back and draw navel toward spine.',
      '**Phase 4 (Breathing Hold)**: Hold rigid posture for target duration with calm, steady diaphragmatic breathing.'
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
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plankCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <g transform="translate(80, 20)">
        <rect x="0" y="0" width="600" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="20" y="10" width="560" height="24" rx="8" fill="#d1fae5" />
        <text x="300" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">RIGID 360° CORE CYLINDER PLANK ALIGNMENT</text>

        <!-- Ground Contact Shadow -->
        <ellipse cx="300" cy="205" rx="240" ry="6" fill="#a7f3d0" opacity="0.8" />

        <!-- Human Model in Perfect Plank -->
        <!-- Head & Neutral Neck -->
        <circle cx="480" cy="115" r="13" fill="#1e293b" />
        
        <!-- Forearms under shoulders -->
        <path d="M 455 125 L 455 188 L 505 188" fill="none" stroke="#334155" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Rigid Straight Body Line (Heels to Head) -->
        <path d="M 120 180 C 180 165, 300 145, 455 125 C 455 138, 440 148, 380 160 C 260 175, 180 185, 120 190 Z" fill="url(#plankCoreGrad)" stroke="#047857" stroke-width="1.5" />
        
        <!-- Tucked Toes -->
        <path d="M 120 180 L 110 190 L 125 190 Z" fill="#1e293b" />

        <!-- 360° Core Cylinder Highlight Ring -->
        <ellipse cx="310" cy="155" rx="35" ry="18" fill="#f59e0b" opacity="0.35" stroke="#d97706" stroke-width="2" stroke-dasharray="4 3" />
        <text x="310" y="159" text-anchor="middle" font-size="9" font-weight="black" fill="#92400e">BRACED 360° CORE</text>

        <!-- Neutral Plumb Line -->
        <line x1="110" y1="140" x2="495" y2="105" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" />
        <text x="300" y="98" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Straight line from heels through hips to shoulders</text>
        <text x="300" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Elbows under shoulders • Glutes tight • Neutral neck</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-bird-dog',
    name: 'Bird-Dog Core Stability & Spinal Balance',
    category: 'Core & Posture',
    purpose: 'Rehabilitation-grade spinal stabilization that strengthens multifidus and deep core musculature with zero spinal compression.',
    targetMuscles: ['Multifidus', 'Erector Spinae', 'Gluteus Maximus', 'Anterior Deltoids'],
    primaryMover: 'Multifidus & Gluteus Maximus',
    secondaryStabilizers: ['Transverse Abdominis', 'Shoulder Girdle', 'Obliques'],
    startingPosition: 'Tabletop position on hands and knees. Hands positioned directly below shoulders, knees directly below hips, spine in neutral alignment.',
    correctForm: 'Gaze stays fixed straight down at the mat. Hips remain completely level with zero sideways rotation or lower back arching.',
    stepByStepInstructions: [
      '**Phase 1 (Tabletop)**: Setup on hands and knees with neutral spine and core engaged.',
      '**Phase 2 (Opposite Reach)**: Inhale, then as you exhale, simultaneously reach your right arm forward and left leg backward.',
      '**Phase 3 (Parallel Line)**: Extend until arm, torso, and leg form a single horizontal line parallel to the floor.',
      '**Phase 4 (Controlled Return)**: Hold for 2 seconds, then inhale and return to tabletop before alternating sides.'
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
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="bdArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- FRAME 1: Tabletop Setup -->
      <g transform="translate(60, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#f1f5f9" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. START: Neutral Tabletop</text>

        <circle cx="185" cy="115" r="12" fill="#1e293b" />
        <!-- Tabletop Torso -->
        <path d="M 175 125 C 150 125, 110 125, 95 125 C 95 135, 175 135, 175 125 Z" fill="#1e293b" />
        <!-- Arms and Knees -->
        <line x1="170" y1="125" x2="170" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        <line x1="105" y1="125" x2="105" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Hands under shoulders • Knees under hips</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(340, 100)">
        <path d="M 0 20 C 25 5, 55 5, 80 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#bdArrow)" />
        <text x="40" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">Extend Opposite Limbs</text>
      </g>

      <!-- FRAME 2: Extended Parallel Line -->
      <g transform="translate(440, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#d1fae5" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">2. PARALLEL EXTENSION & STABILIZATION</text>

        <circle cx="170" cy="115" r="12" fill="#1e293b" />
        
        <!-- Forward Extended Arm -->
        <path d="M 165 125 L 245 125" stroke="#059669" stroke-width="6" stroke-linecap="round" />
        <!-- Backward Extended Leg -->
        <path d="M 105 125 L 25 125" stroke="#059669" stroke-width="6" stroke-linecap="round" />
        
        <!-- Ground Arm and Knee -->
        <line x1="165" y1="125" x2="165" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        <line x1="105" y1="125" x2="105" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />

        <!-- Core Spine -->
        <path d="M 165 125 L 105 125" stroke="#10b981" stroke-width="8" stroke-linecap="round" />

        <!-- Parallel Reference Line -->
        <line x1="20" y1="125" x2="250" y2="125" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 3" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Reach long through fingers & heel</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-rows',
    name: 'Resistance Band Rows (Desk Posture Reset)',
    category: 'Strength & Tone',
    purpose: 'Reverses rounded-shoulder desk slouch, strengthens rhomboids and middle trapezius, and opens thoracic chest cavity.',
    targetMuscles: ['Rhomboids', 'Latissimus Dorsi', 'Middle Trapezius', 'Rear Deltoids'],
    primaryMover: 'Rhomboids & Latissimus Dorsi',
    secondaryStabilizers: ['Biceps', 'Erector Spinae', 'Rotator Cuff'],
    startingPosition: 'Sit tall on floor with legs extended, loop resistance band around midfoot and grasp both ends with arms straight.',
    correctForm: 'Sit tall with chest proud. Initiate movement by pinching shoulder blades together, driving elbows backward close to ribs.',
    stepByStepInstructions: [
      '**Phase 1 (Setup)**: Sit tall with legs straight, band looped securely around midfoot, arms extended.',
      '**Phase 2 (Scapular Retraction)**: Inhale, pull shoulders back, and initiate row by pinching shoulder blades together.',
      '**Phase 3 (Elbow Drive)**: Exhale and pull elbows back close to ribcage, contracting upper back for 2 seconds.',
      '**Phase 4 (Controlled Release)**: Inhale and slowly extend arms forward over 3 seconds.'
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
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="rowArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- FRAME 1: Arms Extended -->
      <g transform="translate(60, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#f1f5f9" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. START: Arms Extended Setup</text>

        <!-- Seated Model -->
        <circle cx="80" cy="110" r="12" fill="#1e293b" />
        <path d="M 75 122 L 75 188 L 195 188" stroke="#1e293b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <!-- Extended Arms & Band -->
        <line x1="78" y1="135" x2="185" y2="155" stroke="#334155" stroke-width="5" stroke-linecap="round" />
        <line x1="185" y1="155" x2="195" y2="188" stroke="#0d9488" stroke-width="3" stroke-dasharray="3 2" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Sit tall • Chest proud • Arms extended</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(340, 100)">
        <path d="M 0 20 C 25 5, 55 5, 80 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#rowArrow)" />
        <text x="40" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">Elbows Back & Squeeze</text>
      </g>

      <!-- FRAME 2: Scapular Retraction -->
      <g transform="translate(440, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#d1fae5" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">2. ELBOW DRIVE & SCAPULAR PINCH</text>

        <circle cx="80" cy="110" r="12" fill="#1e293b" />
        <path d="M 75 122 L 75 188 L 195 188" stroke="#1e293b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        
        <!-- Bent Elbows Driven Back -->
        <path d="M 78 135 L 50 145 L 85 145" stroke="#059669" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        
        <!-- Upper Back Highlight -->
        <circle cx="68" cy="135" r="14" fill="#f59e0b" opacity="0.4" />
        <text x="68" y="138" text-anchor="middle" font-size="8" font-weight="black" fill="#92400e">RHOMBOIDS</text>

        <!-- Band Tension -->
        <line x1="85" y1="145" x2="195" y2="188" stroke="#0d9488" stroke-width="3" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Pinch shoulder blades for 2 seconds</text>
      </g>
    </svg>`
  },
  {
    id: 'ex-guide-incline-pushup',
    name: 'Incline Push-Ups (Desk / Wall)',
    category: 'Strength & Tone',
    purpose: 'Builds upper-body pushing power, pectoral strength, and anterior shoulder tone while remaining gentle on wrists and joints.',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps', 'Core'],
    primaryMover: 'Pectoralis Major & Triceps',
    secondaryStabilizers: ['Anterior Deltoids', 'Core Cylinder', 'Serratus Anterior'],
    startingPosition: 'Place hands shoulder-width on a sturdy table, countertop, or wall. Step feet back into an incline plank.',
    correctForm: 'Body forms a straight line from heels to head. Elbows track back at a 45-degree angle (arrow shape), never flaring out into a T.',
    stepByStepInstructions: [
      '**Phase 1 (Setup)**: Hands on sturdy elevated surface, body in straight diagonal plank.',
      '**Phase 2 (Descent)**: Inhale and lower chest toward surface over 2-3 seconds with elbows at 45°.',
      '**Phase 3 (Depth)**: Lower until chest is 2 inches from surface without sagging hips.',
      '**Phase 4 (Press)**: Exhale forcefully and press through palms to return to top plank.'
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
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="pushArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- Incline Push-Up Sequence -->
      <g transform="translate(80, 20)">
        <rect x="0" y="0" width="600" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="20" y="10" width="560" height="24" rx="8" fill="#d1fae5" />
        <text x="300" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">INCLINE PUSH-UP 45° ELBOW PATH & CHEST CONTRACTION</text>

        <!-- Elevated Bench Structure -->
        <rect x="440" y="140" width="40" height="65" rx="4" fill="#334155" />
        <rect x="420" y="135" width="80" height="8" rx="2" fill="#0f172a" />

        <!-- Diagonal Model (Descent to Bench) -->
        <circle cx="410" cy="115" r="12" fill="#1e293b" />
        
        <!-- Straight Rigid Body Line -->
        <path d="M 160 190 L 390 125" stroke="#059669" stroke-width="8" stroke-linecap="round" />
        
        <!-- Arms at 45° Angle -->
        <path d="M 385 126 L 415 140 L 435 140" fill="none" stroke="#047857" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Chest Highlight Badge -->
        <circle cx="390" cy="132" r="14" fill="#f59e0b" opacity="0.4" />
        <text x="390" y="135" text-anchor="middle" font-size="8" font-weight="black" fill="#92400e">PECS</text>

        <text x="300" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Elbows tuck 45° in arrow shape • Body stays rigid</text>
      </g>
    </svg>`
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
      '**Cow Phase**: Inhale slowly through nose, drop belly gently toward mat, lift chest and gaze toward ceiling.',
      'Feel gentle expansion across the front of the abdomen.',
      '**Cat Phase**: Exhale fully through mouth, round spine upward toward ceiling, tuck chin to chest and draw navel in.',
      'Flow smoothly between both phases for 8-10 complete breath cycles.'
    ],
    breathingGuidance: 'Deep 4-second inhale on Cow; complete 4-second exhale on Cat.',
    tempoGuidance: '4s Inhale / 4s Exhale smooth wave.',
    recommendedDose: {
      sets: 2,
      repsOrDuration: '8 - 10 slow breath cycles',
      restBetweenSets: '30 seconds'
    },
    restAndRecovery: 'Rest 30 seconds. Feel the parasympathetic relaxation.',
    commonMistakes: ['Rushing through breath cycles', 'Forcing neck into sharp extension.'],
    safetyTips: ['Move gently within a pain-free range of motion.'],
    modifications: 'Can be performed seated on a chair during desk breaks.',
    diagramSvg: `<svg viewBox="0 0 760 280" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="catArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0d9488" />
        </marker>
      </defs>

      <rect x="20" y="240" width="720" height="2" fill="#cbd5e1" />
      <line x1="20" y1="241" x2="740" y2="241" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- FRAME 1: COW POSE (Inhale & Arch) -->
      <g transform="translate(60, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#f1f5f9" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f766e">1. COW: Inhale & Abdominal Stretch</text>

        <circle cx="180" cy="105" r="12" fill="#1e293b" />
        <!-- Curved Dropped Spine (Cow) -->
        <path d="M 170 120 Q 135 145 95 125" fill="none" stroke="#059669" stroke-width="8" stroke-linecap="round" />
        <line x1="170" y1="120" x2="170" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        <line x1="95" y1="125" x2="95" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#64748b">Inhale • Drop belly • Gaze up</text>
      </g>

      <!-- Flow Arrow -->
      <g transform="translate(340, 100)">
        <path d="M 0 20 C 25 5, 55 5, 80 20" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#catArrow)" />
        <text x="40" y="2" text-anchor="middle" font-size="9" font-weight="bold" fill="#059669">4s Wave Transition</text>
      </g>

      <!-- FRAME 2: CAT POSE (Exhale & Round) -->
      <g transform="translate(440, 20)">
        <rect x="0" y="0" width="260" height="215" rx="16" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" />
        <rect x="15" y="10" width="230" height="24" rx="8" fill="#d1fae5" />
        <text x="130" y="26" text-anchor="middle" font-size="11" font-weight="black" fill="#065f46">2. CAT: Exhale & Rounded Spine</text>

        <circle cx="180" cy="135" r="12" fill="#1e293b" />
        <!-- Rounded Arch Spine (Cat) -->
        <path d="M 170 130 Q 135 95 95 125" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round" />
        <line x1="170" y1="130" x2="170" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        <line x1="95" y1="125" x2="95" y2="188" stroke="#334155" stroke-width="6" stroke-linecap="round" />
        
        <text x="130" y="222" text-anchor="middle" font-size="9" font-weight="bold" fill="#047857">Exhale • Tuck chin • Core engage</text>
      </g>
    </svg>`
  }
];
