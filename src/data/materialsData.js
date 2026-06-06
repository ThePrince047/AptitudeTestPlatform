// ─── APTITUDE MATERIALS DATA ──────────────────────────────────────────────────
// All formulas, tricks, and methods organized by category

export const MATERIALS = [
  {
    id: "time-speed-distance",
    title: "Time, Speed & Distance",
    icon: "🚀",
    color: "#3B82F6",
    colorSoft: "rgba(59,130,246,0.10)",
    colorLine: "rgba(59,130,246,0.25)",
    tag: "TSD",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Speed", formula: "Speed = Distance / Time", note: "S = D/T" },
          { label: "Distance", formula: "Distance = Speed × Time", note: "D = S × T" },
          { label: "Time", formula: "Time = Distance / Speed", note: "T = D/S" },
        ]
      },
      {
        title: "Unit Conversions",
        items: [
          { label: "km/h → m/s", formula: "Multiply by 5/18", note: "e.g. 72 km/h = 72×5/18 = 20 m/s" },
          { label: "m/s → km/h", formula: "Multiply by 18/5", note: "e.g. 20 m/s = 20×18/5 = 72 km/h" },
        ]
      },
      {
        title: "Average Speed",
        items: [
          { label: "When equal distances", formula: "Avg Speed = 2ab / (a+b)", note: "a & b are two different speeds for same distance" },
          { label: "When equal times", formula: "Avg Speed = (a+b) / 2", note: "Simple arithmetic mean of speeds" },
        ]
      },
      {
        title: "Relative Speed",
        items: [
          { label: "Same direction", formula: "Relative Speed = |S₁ - S₂|", note: "Subtract speeds when moving same way" },
          { label: "Opposite direction", formula: "Relative Speed = S₁ + S₂", note: "Add speeds when moving towards each other" },
          { label: "Train crossing a pole", formula: "Time = Length of Train / Speed", note: "Pole is a point object" },
          { label: "Train crossing platform", formula: "Time = (Train + Platform length) / Speed", note: "Both lengths counted" },
          { label: "Two trains (same dir)", formula: "Time = (L₁+L₂) / (S₁−S₂)", note: "" },
          { label: "Two trains (opp dir)", formula: "Time = (L₁+L₂) / (S₁+S₂)", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "If A is x times faster than B → A's speed = x × B's speed. Time taken by A = B's time / x",
          "A man walking at 3/4 of original speed is late by T min → Original time = 3T min",
          "Meeting point trick: If two people start from A and B, distance = D. They meet first time after D/(S₁+S₂) hours",
          "Ratio of speeds A:B = a:b → Ratio of times = b:a (inverse)"
        ]
      }
    ]
  },

  {
    id: "profit-loss",
    title: "Profit & Loss",
    icon: "📈",
    color: "#22C55E",
    colorSoft: "rgba(34,197,94,0.10)",
    colorLine: "rgba(34,197,94,0.25)",
    tag: "P&L",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Profit", formula: "Profit = SP − CP", note: "SP = Selling Price, CP = Cost Price" },
          { label: "Loss", formula: "Loss = CP − SP", note: "When CP > SP" },
          { label: "Profit %", formula: "Profit% = (Profit / CP) × 100", note: "Always calculated on CP" },
          { label: "Loss %", formula: "Loss% = (Loss / CP) × 100", note: "Always calculated on CP" },
          { label: "SP from Profit%", formula: "SP = CP × (100 + P%) / 100", note: "" },
          { label: "SP from Loss%", formula: "SP = CP × (100 − L%) / 100", note: "" },
          { label: "CP from SP (Profit)", formula: "CP = SP × 100 / (100 + P%)", note: "" },
          { label: "CP from SP (Loss)", formula: "CP = SP × 100 / (100 − L%)", note: "" },
        ]
      },
      {
        title: "Discount",
        items: [
          { label: "Discount", formula: "Discount = Marked Price − SP", note: "" },
          { label: "Discount %", formula: "Discount% = (Discount / MP) × 100", note: "Always on Marked Price" },
          { label: "SP after discount", formula: "SP = MP × (100 − D%) / 100", note: "" },
        ]
      },
      {
        title: "Successive Discounts",
        items: [
          { label: "Two discounts a% & b%", formula: "Net Discount = a + b − (ab/100)", note: "Single equivalent discount" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "Selling at same price: one at x% profit, another at x% loss → always overall LOSS = x²/100 %",
          "Shopkeeper uses false weight w instead of W → Profit% = (W−w)/w × 100",
          "If CP of A articles = SP of B articles → Profit% = (A−B)/B × 100",
          "Mark up x%, discount y% → Net = x − y − xy/100 (positive = profit, negative = loss)"
        ]
      }
    ]
  },

  {
    id: "percentages",
    title: "Percentages",
    icon: "💯",
    color: "#F59E0B",
    colorSoft: "rgba(245,158,11,0.10)",
    colorLine: "rgba(245,158,11,0.25)",
    tag: "%",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Percentage", formula: "P% = (Part / Whole) × 100", note: "" },
          { label: "Value from %", formula: "Value = (P% / 100) × Total", note: "" },
          { label: "% increase", formula: "% Increase = (Increase / Original) × 100", note: "" },
          { label: "% decrease", formula: "% Decrease = (Decrease / Original) × 100", note: "" },
          { label: "New value after x% increase", formula: "New = Original × (1 + x/100)", note: "" },
          { label: "New value after x% decrease", formula: "New = Original × (1 − x/100)", note: "" },
        ]
      },
      {
        title: "Change & Reverse",
        items: [
          { label: "Original before x% increase", formula: "Original = New × 100 / (100 + x)", note: "" },
          { label: "Original before x% decrease", formula: "Original = New × 100 / (100 − x)", note: "" },
        ]
      },
      {
        title: "Important % Fractions",
        type: "table",
        rows: [
          ["10%", "1/10"], ["12.5%", "1/8"], ["16.67%", "1/6"],
          ["20%", "1/5"], ["25%", "1/4"], ["33.33%", "1/3"],
          ["37.5%", "3/8"], ["40%", "2/5"], ["50%", "1/2"],
          ["60%", "3/5"], ["66.67%", "2/3"], ["75%", "3/4"],
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "A is x% more than B → B is x/(100+x) × 100 % less than A",
          "A is x% less than B → B is x/(100−x) × 100 % more than A",
          "Two successive % changes of a% & b% → Net change = a+b+ab/100",
          "Population increase r% for n years → P(1+r/100)ⁿ"
        ]
      }
    ]
  },

  {
    id: "simple-compound-interest",
    title: "Simple & Compound Interest",
    icon: "🏦",
    color: "#EC4899",
    colorSoft: "rgba(236,72,153,0.10)",
    colorLine: "rgba(236,72,153,0.25)",
    tag: "SI/CI",
    topics: [
      {
        title: "Simple Interest",
        items: [
          { label: "SI", formula: "SI = (P × R × T) / 100", note: "P=Principal, R=Rate%, T=Time(years)" },
          { label: "Amount", formula: "A = P + SI", note: "" },
          { label: "Principal", formula: "P = (SI × 100) / (R × T)", note: "" },
          { label: "Rate", formula: "R = (SI × 100) / (P × T)", note: "" },
          { label: "Time", formula: "T = (SI × 100) / (P × R)", note: "" },
        ]
      },
      {
        title: "Compound Interest",
        items: [
          { label: "Amount (annual)", formula: "A = P(1 + R/100)ⁿ", note: "n = number of years" },
          { label: "CI", formula: "CI = A − P", note: "" },
          { label: "Half-yearly compounding", formula: "A = P(1 + R/200)²ⁿ", note: "Rate halved, periods doubled" },
          { label: "Quarterly compounding", formula: "A = P(1 + R/400)⁴ⁿ", note: "Rate quartered, periods ×4" },
        ]
      },
      {
        title: "SI vs CI Comparison",
        items: [
          { label: "CI − SI (2 years)", formula: "CI − SI = P(R/100)²", note: "Quick shortcut" },
          { label: "CI − SI (3 years)", formula: "CI − SI = P(R/100)²(3 + R/100)", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "Rule of 72: Doubling time ≈ 72/R years (at compound interest)",
          "If SI for 2 yr = X → SI for 1 yr = X/2. CI for 2 yr = X + X×R/200",
          "When CI & SI differ for 2 years: R² = (CI−SI)×10000/P",
          "Installment SI: P = Each installment × 100 / [100 + R×n(n+1)/200] for n installments"
        ]
      }
    ]
  },

  {
    id: "ratio-proportion",
    title: "Ratio & Proportion",
    icon: "⚖️",
    color: "#7C3AED",
    colorSoft: "rgba(124,58,237,0.10)",
    colorLine: "rgba(124,58,237,0.25)",
    tag: "R&P",
    topics: [
      {
        title: "Core Concepts",
        items: [
          { label: "Ratio", formula: "a:b = a/b", note: "Must have same units" },
          { label: "Proportion", formula: "a:b = c:d → a×d = b×c", note: "Product of extremes = Product of means" },
          { label: "Mean proportional", formula: "b = √(a×c)", note: "Where b is mean proportional of a and c" },
          { label: "Third proportional", formula: "c = b²/a", note: "a:b = b:c" },
        ]
      },
      {
        title: "Mixtures & Alligation",
        items: [
          { label: "Alligation Rule", formula: "Cheaper : Dearer = (Mean−Cheaper) : (Dearer−Mean)", note: "Diagonal cross rule" },
          { label: "Mixture removal", formula: "Final pure = P(1 − x/V)ⁿ", note: "P=initial, x=removed, V=vessel, n=times" },
        ]
      },
      {
        title: "Partnership",
        items: [
          { label: "Simple partnership", formula: "Profit ∝ Capital invested", note: "Ratio of profit = ratio of capital" },
          { label: "Compound partnership", formula: "Profit ∝ Capital × Time", note: "Multiply capital by time period" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "If a:b = m:n, then (a+b):(a−b) = (m+n):(m−n) — componendo dividendo",
          "Three numbers in ratio a:b:c, sum=S → each part = S × a/(a+b+c) etc.",
          "Milk & water: if x liters removed n times from V liters → milk left = V(1−x/V)ⁿ",
          "Alligation shortcut: mix two at prices P1 & P2 to get mean price M → ratio = (P2−M):(M−P1)"
        ]
      }
    ]
  },

  {
    id: "work-time",
    title: "Work & Time",
    icon: "🔧",
    color: "#06B6D4",
    colorSoft: "rgba(6,182,212,0.10)",
    colorLine: "rgba(6,182,212,0.25)",
    tag: "W&T",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Work done", formula: "Work = Efficiency × Time", note: "" },
          { label: "Combined work", formula: "1/T = 1/A + 1/B", note: "A & B work together → T days" },
          { label: "A+B together", formula: "T = AB / (A+B)", note: "Days together" },
          { label: "A alone (if B leaves early)", formula: "Work left when B leaves × A's rate", note: "Handle remaining work separately" },
        ]
      },
      {
        title: "Efficiency Method",
        items: [
          { label: "Efficiency of A", formula: "Efficiency = 1/A (fraction per day)", note: "A takes A days" },
          { label: "LCM method", formula: "Total Work = LCM(A, B, C, ...)", note: "Per day work = LCM/individual days" },
        ]
      },
      {
        title: "Pipes & Cisterns",
        items: [
          { label: "Inlet pipe fills in A hr", formula: "1/A (per hour)", note: "Positive contribution" },
          { label: "Outlet empties in B hr", formula: "1/B (per hour)", note: "Negative contribution" },
          { label: "Net rate", formula: "Net = 1/A − 1/B", note: "Time = 1/Net" },
          { label: "Two inlets A & B", formula: "T = AB/(A+B)", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "LCM trick: Take LCM of all days as total work. Each person's efficiency = LCM/their days.",
          "M men finish in D days → Total = M×D man-days. New time = Total/(new men)",
          "A is x times efficient as B → A takes 1/x times the time B takes",
          "If A can do in a days, B in b days, A leaves after x days → remaining work = 1 − x/a, done by B in (1−x/a)×b days"
        ]
      }
    ]
  },

  {
    id: "number-system",
    title: "Number System",
    icon: "🔢",
    color: "#F97316",
    colorSoft: "rgba(249,115,22,0.10)",
    colorLine: "rgba(249,115,22,0.25)",
    tag: "NUM",
    topics: [
      {
        title: "Divisibility Rules",
        type: "table",
        rows: [
          ["÷2", "Last digit even (0,2,4,6,8)"],
          ["÷3", "Sum of digits divisible by 3"],
          ["÷4", "Last 2 digits divisible by 4"],
          ["÷5", "Last digit 0 or 5"],
          ["÷6", "Divisible by both 2 and 3"],
          ["÷7", "Double last digit, subtract from rest; result ÷7"],
          ["÷8", "Last 3 digits divisible by 8"],
          ["÷9", "Sum of digits divisible by 9"],
          ["÷11", "Alternating sum (odd pos − even pos) ÷11"],
          ["÷12", "Divisible by both 4 and 3"],
          ["÷25", "Last 2 digits divisible by 25"],
        ]
      },
      {
        title: "HCF & LCM",
        items: [
          { label: "HCF × LCM", formula: "HCF × LCM = Product of two numbers", note: "Only for two numbers" },
          { label: "Fraction HCF", formula: "HCF = HCF(numerators) / LCM(denominators)", note: "" },
          { label: "Fraction LCM", formula: "LCM = LCM(numerators) / HCF(denominators)", note: "" },
        ]
      },
      {
        title: "Remainders & Properties",
        items: [
          { label: "Unit digit of powers", formula: "Cyclicity pattern: 2→4, 3→4, 4→2, 5→1, 6→1, 7→4, 8→4, 9→2", note: "Cycle length for last digit" },
          { label: "Sum of 1 to n", formula: "n(n+1)/2", note: "" },
          { label: "Sum of squares", formula: "n(n+1)(2n+1)/6", note: "" },
          { label: "Sum of cubes", formula: "[n(n+1)/2]²", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "aⁿ − bⁿ is ALWAYS divisible by (a−b)",
          "aⁿ − bⁿ is divisible by (a+b) when n is even",
          "aⁿ + bⁿ is divisible by (a+b) when n is odd",
          "Remainder of any number ÷9 = sum of its digits ÷9",
          "Power of prime p in n! = ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + ..."
        ]
      }
    ]
  },

  {
    id: "averages",
    title: "Averages",
    icon: "📊",
    color: "#10B981",
    colorSoft: "rgba(16,185,129,0.10)",
    colorLine: "rgba(16,185,129,0.25)",
    tag: "AVG",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Average", formula: "Average = Sum of all items / Number of items", note: "" },
          { label: "Sum", formula: "Sum = Average × Number of items", note: "" },
          { label: "Weighted Average", formula: "Avg = (w₁x₁ + w₂x₂ + ...) / (w₁ + w₂ + ...)", note: "" },
        ]
      },
      {
        title: "Arithmetic Progressions",
        items: [
          { label: "Average of AP", formula: "Average = (First + Last) / 2", note: "Also = middle term" },
          { label: "Consecutive integers avg", formula: "Average = (n+1)/2 for 1 to n", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "New average when one item added: New Avg = Old Avg + (New Value − Old Avg)/(n+1)",
          "New average when item removed: New Avg = Old Avg − (Removed Value − Old Avg)/(n−1)",
          "If avg of n numbers is A, and one number is replaced by X → change in avg = (X − replaced)/ n",
          "Average of first n odd numbers = n. Average of first n even numbers = n+1",
          "Average of n consecutive numbers starting from a = a + (n−1)/2"
        ]
      }
    ]
  },

  {
    id: "algebra",
    title: "Algebra & Equations",
    icon: "🔣",
    color: "#8B5CF6",
    colorSoft: "rgba(139,92,246,0.10)",
    colorLine: "rgba(139,92,246,0.25)",
    tag: "ALG",
    topics: [
      {
        title: "Key Identities",
        items: [
          { label: "(a+b)²", formula: "a² + 2ab + b²", note: "" },
          { label: "(a−b)²", formula: "a² − 2ab + b²", note: "" },
          { label: "(a+b)(a−b)", formula: "a² − b²", note: "Difference of squares" },
          { label: "(a+b)³", formula: "a³ + 3a²b + 3ab² + b³", note: "" },
          { label: "(a−b)³", formula: "a³ − 3a²b + 3ab² − b³", note: "" },
          { label: "a³+b³", formula: "(a+b)(a²−ab+b²)", note: "" },
          { label: "a³−b³", formula: "(a−b)(a²+ab+b²)", note: "" },
          { label: "a²+b²", formula: "(a+b)² − 2ab = (a−b)² + 2ab", note: "" },
        ]
      },
      {
        title: "Quadratic Equations",
        items: [
          { label: "Roots", formula: "x = [−b ± √(b²−4ac)] / 2a", note: "Discriminant D = b²−4ac" },
          { label: "D > 0", formula: "Two real distinct roots", note: "" },
          { label: "D = 0", formula: "Two equal real roots", note: "" },
          { label: "D < 0", formula: "No real roots (complex)", note: "" },
          { label: "Sum of roots", formula: "α + β = −b/a", note: "" },
          { label: "Product of roots", formula: "αβ = c/a", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "If x + 1/x = k → x² + 1/x² = k² − 2; x³ + 1/x³ = k³ − 3k",
          "If x − 1/x = k → x² + 1/x² = k² + 2",
          "For any two numbers: (AM)² ≥ (GM)² → (a+b)²/4 ≥ ab",
          "Sum of roots changes sign of coefficient of x; product is constant term / leading coefficient"
        ]
      }
    ]
  },

  {
    id: "geometry",
    title: "Geometry & Mensuration",
    icon: "📐",
    color: "#EF4444",
    colorSoft: "rgba(239,68,68,0.10)",
    colorLine: "rgba(239,68,68,0.25)",
    tag: "GEO",
    topics: [
      {
        title: "2D Shapes",
        type: "table",
        rows: [
          ["Square (side a)", "Area = a² | Perimeter = 4a | Diagonal = a√2"],
          ["Rectangle (l×b)", "Area = l×b | Perimeter = 2(l+b) | Diagonal = √(l²+b²)"],
          ["Triangle", "Area = ½×base×height | Perimeter = a+b+c"],
          ["Equilateral △ (side a)", "Area = (√3/4)a² | Height = (√3/2)a"],
          ["Right △", "Hyp² = P²+B² | Area = ½×P×B"],
          ["Circle (r)", "Area = πr² | Circumference = 2πr"],
          ["Semi-circle", "Area = πr²/2 | Perimeter = πr+2r"],
          ["Parallelogram", "Area = base×height | Perimeter = 2(a+b)"],
          ["Trapezium", "Area = ½×(a+b)×h"],
          ["Rhombus", "Area = ½×d₁×d₂ | Side = √(d₁²+d₂²)/2"],
        ]
      },
      {
        title: "3D Shapes",
        type: "table",
        rows: [
          ["Cube (a)", "Volume=a³ | LSA=4a² | TSA=6a² | Diagonal=a√3"],
          ["Cuboid (l,b,h)", "Volume=lbh | LSA=2h(l+b) | TSA=2(lb+bh+lh)"],
          ["Cylinder (r,h)", "Volume=πr²h | CSA=2πrh | TSA=2πr(r+h)"],
          ["Cone (r,l,h)", "Volume=⅓πr²h | CSA=πrl | TSA=πr(r+l) | l=√(r²+h²)"],
          ["Sphere (r)", "Volume=⁴⁄₃πr³ | Surface=4πr²"],
          ["Hemisphere (r)", "Volume=⅔πr³ | CSA=2πr² | TSA=3πr²"],
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "If all sides of rectangle increased by x% → Area increases by (2x + x²/100)%",
          "Radius increased by r% → Area increases by (2r + r²/100)%",
          "Diagonal of square = side × √2 ≈ side × 1.414",
          "Heron's formula: Area = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2",
          "Sum of angles in polygon of n sides = (n−2) × 180°"
        ]
      }
    ]
  },

  {
    id: "probability",
    title: "Probability",
    icon: "🎲",
    color: "#14B8A6",
    colorSoft: "rgba(20,184,166,0.10)",
    colorLine: "rgba(20,184,166,0.25)",
    tag: "PROB",
    topics: [
      {
        title: "Core Formulas",
        items: [
          { label: "Probability", formula: "P(E) = Favorable Outcomes / Total Outcomes", note: "0 ≤ P(E) ≤ 1" },
          { label: "Complement", formula: "P(E') = 1 − P(E)", note: "Probability of NOT happening" },
          { label: "Addition Rule", formula: "P(A∪B) = P(A) + P(B) − P(A∩B)", note: "" },
          { label: "Mutually exclusive", formula: "P(A∪B) = P(A) + P(B)", note: "When A∩B = 0" },
          { label: "Independent events", formula: "P(A∩B) = P(A) × P(B)", note: "" },
          { label: "Conditional prob", formula: "P(A|B) = P(A∩B) / P(B)", note: "" },
        ]
      },
      {
        title: "Permutation & Combination",
        items: [
          { label: "nPr", formula: "nPr = n! / (n−r)!", note: "Arrangements (order matters)" },
          { label: "nCr", formula: "nCr = n! / [r!(n−r)!]", note: "Selections (order doesn't matter)" },
          { label: "nCr = nC(n−r)", formula: "Symmetric property", note: "" },
          { label: "nC0 = nCn = 1", formula: "Always", note: "" },
        ]
      },
      {
        title: "Standard Outcomes",
        type: "table",
        rows: [
          ["Coin toss", "Sample space = 2 | Heads/Tails = 1 each"],
          ["Two coins", "Sample space = 4 | HH,HT,TH,TT"],
          ["Die", "Sample space = 6 | Each face = 1"],
          ["Two dice", "Sample space = 36"],
          ["Deck of cards", "52 cards | 4 suits, 13 each | Face cards = 12"],
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "At least one = 1 − P(none). Always easier to calculate complement.",
          "Balls in bag: P(same color) when 2 drawn = nC2/NC2 for each color",
          "nCr + nC(r−1) = (n+1)Cr — Pascal's triangle rule",
          "Probability of exactly k successes in n trials = nCk × pᵏ × (1−p)ⁿ⁻ᵏ"
        ]
      }
    ]
  },

  {
    id: "age-problems",
    title: "Age Problems",
    icon: "👤",
    color: "#A855F7",
    colorSoft: "rgba(168,85,247,0.10)",
    colorLine: "rgba(168,85,247,0.25)",
    tag: "AGE",
    topics: [
      {
        title: "Key Approach",
        items: [
          { label: "Present age assumption", formula: "Let present age = x, solve equation", note: "Always define variable clearly" },
          { label: "n years ago", formula: "Age was = (x − n)", note: "" },
          { label: "n years later", formula: "Age will be = (x + n)", note: "" },
          { label: "Ratio of ages", formula: "If ratio is a:b → ages are ak & bk", note: "Find k from extra condition" },
        ]
      },
      {
        title: "Common Problem Types",
        items: [
          { label: "Sum/difference given", formula: "Set up equations; solve simultaneously", note: "" },
          { label: "Ratio changes over time", formula: "Past ratio gives one eq, future gives another", note: "" },
          { label: "Average age of group", formula: "Total age = avg × number of people", note: "" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "If ages of A & B are in ratio p:q and after n years ratio becomes r:s → solve (pk+n)/(qk+n) = r/s",
          "When ages differ by constant d: this difference never changes over time",
          "If father is x times older than son now, after y years he'll be z times: solve x(son) + y = z(son+y)",
          "For three people: Sum of ages = given. Age difference is constant over time."
        ]
      }
    ]
  },

  {
    id: "series-sequences",
    title: "Series & Sequences",
    icon: "🔁",
    color: "#F43F5E",
    colorSoft: "rgba(244,63,94,0.10)",
    colorLine: "rgba(244,63,94,0.25)",
    tag: "SEQ",
    topics: [
      {
        title: "Arithmetic Progression (AP)",
        items: [
          { label: "nth term", formula: "aₙ = a + (n−1)d", note: "a=first term, d=common difference" },
          { label: "Sum of n terms", formula: "Sₙ = n/2 × [2a + (n−1)d]", note: "" },
          { label: "Sₙ (using last term)", formula: "Sₙ = n/2 × (a + l)", note: "l = last term" },
          { label: "Common difference", formula: "d = (l−a)/(n−1)", note: "" },
        ]
      },
      {
        title: "Geometric Progression (GP)",
        items: [
          { label: "nth term", formula: "aₙ = ar^(n−1)", note: "r = common ratio" },
          { label: "Sum of n terms (r≠1)", formula: "Sₙ = a(rⁿ−1)/(r−1) if r>1", note: "or a(1−rⁿ)/(1−r) if r<1" },
          { label: "Sum of infinite GP", formula: "S∞ = a/(1−r), |r|<1", note: "" },
        ]
      },
      {
        title: "Important Series",
        items: [
          { label: "1+2+3+...+n", formula: "n(n+1)/2", note: "" },
          { label: "1²+2²+...+n²", formula: "n(n+1)(2n+1)/6", note: "" },
          { label: "1³+2³+...+n³", formula: "[n(n+1)/2]²", note: "" },
          { label: "2+4+6+...+2n", formula: "n(n+1)", note: "" },
          { label: "1+3+5+...+(2n−1)", formula: "n²", note: "Sum of first n odd numbers" },
        ]
      },
      {
        title: "Tricks & Shortcuts",
        type: "tricks",
        items: [
          "For AP: If three terms in AP, let them be a−d, a, a+d (sum = 3a)",
          "For GP: If three terms in GP, let them be a/r, a, ar (product = a³)",
          "Check if series is AP: differences between consecutive terms should be equal",
          "Check if series is GP: ratios between consecutive terms should be equal"
        ]
      }
    ]
  },

  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    icon: "🧠",
    color: "#0EA5E9",
    colorSoft: "rgba(14,165,233,0.10)",
    colorLine: "rgba(14,165,233,0.25)",
    tag: "LR",
    topics: [
      {
        title: "Syllogisms",
        items: [
          { label: "All A are B + All B are C", formula: "→ All A are C (valid)", note: "" },
          { label: "Some A are B + All B are C", formula: "→ Some A are C (valid)", note: "" },
          { label: "No A is B + All C are A", formula: "→ No C is B (valid)", note: "" },
          { label: "Possible conclusion", formula: "Use Venn diagrams to check", note: "Draw all possible scenarios" },
        ]
      },
      {
        title: "Blood Relations",
        type: "tricks",
        items: [
          "Father's/Mother's Father = Grandfather | Sister's Son = Nephew | Brother's Son = Nephew",
          "Son's Wife = Daughter-in-law | Daughter's Husband = Son-in-law",
          "Always read the relation from the question end to the person mentioned",
          "Trick: Draw a family tree with M/F labels and generation levels"
        ]
      },
      {
        title: "Directions",
        items: [
          { label: "Clockwise from North", formula: "N → E → S → W → N", note: "Right turns" },
          { label: "Anti-clockwise from North", formula: "N → W → S → E → N", note: "Left turns" },
          { label: "Shadow direction", formula: "Morning: Shadow to West | Evening: Shadow to East", note: "Sun rises East, sets West" },
          { label: "Distance formula", formula: "Use Pythagoras for displacement", note: "√(x²+y²) for L-shape path" },
        ]
      },
      {
        title: "Coding-Decoding",
        type: "tricks",
        items: [
          "Letter coding: A=1, B=2...Z=26. Check if +n or −n pattern or mirror (A=Z, B=Y...)",
          "Reverse alphabet: position of letter from end = 27 − position from start",
          "Number coding: check addition, subtraction, multiplication of letter positions",
          "Symbol coding: tabulate each word-code pair and find pattern per letter"
        ]
      },
      {
        title: "Seating Arrangements",
        type: "tricks",
        items: [
          "Linear arrangement: fix one person and arrange remaining (n−1)! ways",
          "Circular: (n−1)! arrangements | Round table with same direction = (n−1)!/2",
          "Draw a table/circle and fill clues systematically, eliminate contradictions",
          "Start with the most constrained condition (most information given)"
        ]
      }
    ]
  },

  {
    id: "data-interpretation",
    title: "Data Interpretation",
    icon: "📉",
    color: "#64748B",
    colorSoft: "rgba(100,116,139,0.10)",
    colorLine: "rgba(100,116,139,0.25)",
    tag: "DI",
    topics: [
      {
        title: "Key Approaches",
        items: [
          { label: "% change", formula: "[(New−Old)/Old] × 100", note: "Always from OLD value" },
          { label: "% share", formula: "(Part/Total) × 100", note: "" },
          { label: "Ratio comparison", formula: "Convert to decimals for quick comparison", note: "" },
          { label: "Bar chart reading", formula: "Read values carefully — scale matters!", note: "" },
        ]
      },
      {
        title: "Common DI Tricks",
        type: "tricks",
        items: [
          "Approximate! DI rarely needs exact calculation — use rounding to 1-2 decimal places",
          "Percentage comparison: a/b vs c/d → cross multiply: a×d vs c×b",
          "If both numerator and denominator increase, compare their % changes to determine ratio direction",
          "For pie charts: angle = (value/total) × 360°",
          "Read question carefully — 'more than' vs 'more than double' are different!"
        ]
      }
    ]
  }
];
