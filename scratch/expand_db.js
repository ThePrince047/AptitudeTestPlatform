import fs from 'fs';
import path from 'path';

// Define the new 115 questions covering all requested Logical Reasoning topics.
const newQuestions = [
  // ==================== BLOOD RELATIONS (35 questions) ====================
  {
    cat: "Logical Reasoning",
    q: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
    opts: ["Father", "Uncle", "Brother", "Grandfather"],
    ans: 0,
    sol: "Suresh's mother's only son is Suresh himself. So, the boy is Suresh's son, and Suresh is his father."
  },
  {
    cat: "Logical Reasoning",
    q: "If A + B means A is the brother of B; A - B means A is the sister of B and A * B means A is the father of B. Which of the following means that C is the son of M?",
    opts: ["M * N - C + F", "M - N * C + F", "F - C + N * M", "N + M - F * C"],
    ans: 0,
    sol: "M * N means M is the father of N. N - C means N is the sister of C. C + F means C is the brother of F. Since C is the brother of F, C is male. And since N is sister of C and M is father of N, M is the father of C. Thus C is the son of M."
  },
  {
    cat: "Logical Reasoning",
    q: "Introducing a man, a woman said, 'His wife is the only daughter of my father.' How is the man related to that woman?",
    opts: ["Husband", "Brother", "Father-in-law", "Uncle"],
    ans: 0,
    sol: "The only daughter of the woman's father is the woman herself. The man's wife is the only daughter (the woman herself). Therefore, the man is the woman's husband."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a photograph, Vicky said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
    opts: ["His son's", "His father's", "His own", "His nephew's"],
    ans: 0,
    sol: "Vicky has no brother or sister, so 'my father's son' must be Vicky himself. Vicky is the father of the man in the photograph, so the photograph is of Vicky's son."
  },
  {
    cat: "Logical Reasoning",
    q: "A man said to a lady, 'Your mother's husband's sister is my aunt.' How is the lady related to the man?",
    opts: ["Sister", "Mother", "Cousin", "Aunt"],
    ans: 0,
    sol: "The lady's mother's husband is the lady's father. The sister of the lady's father is the lady's aunt. Since the lady's aunt is also the man's aunt, the lady and the man are siblings (or cousins, but sister is the definite option)."
  },
  {
    cat: "Logical Reasoning",
    q: "A and B are brothers. C and D are sisters. A's son is D's brother. How is B related to C?",
    opts: ["Uncle", "Brother", "Father", "Grandfather"],
    ans: 0,
    sol: "A's son is D's brother, which means A is the father of D and C. Since B is A's brother, B is the uncle of C."
  },
  {
    cat: "Logical Reasoning",
    q: "If P + Q means P is the mother of Q; P - Q means P is the brother of Q; P * Q means P is the sister of Q. Which of the following shows that M is the maternal uncle of R?",
    opts: ["M - N + R", "M + N - R", "M * N + R", "M - N * R"],
    ans: 0,
    sol: "M - N means M is the brother of N. N + R means N is the mother of R. Therefore, M is the mother's brother of R, i.e., maternal uncle."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a photograph, a woman says, 'This man's son's sister is my mother-in-law.' How is the woman's husband related to the man in the photograph?",
    opts: ["Grandson", "Son", "Nephew", "Uncle"],
    ans: 0,
    sol: "The sister of the man's son is the man's daughter. The man's daughter is the woman's mother-in-law. The husband of the woman is the son of the mother-in-law, hence the grandson of the man in the photograph."
  },
  {
    cat: "Logical Reasoning",
    q: "Kalyani is the mother-in-law of Veena, who is the sister-in-law of Ashok. Dheeraj is the father of Sundeep, the only brother of Ashok. How is Kalyani related to Ashok?",
    opts: ["Mother", "Aunt", "Wife", "Cousin"],
    ans: 0,
    sol: "Sundeep is the only brother of Ashok. Dheeraj is Ashok's father. Veena is the sister-in-law of Ashok, meaning Veena is married to Ashok's brother Sundeep. Kalyani is Veena's mother-in-law, which means Kalyani is Dheeraj's wife and Ashok's mother."
  },
  {
    cat: "Logical Reasoning",
    q: "A is B's brother. C is A's mother. D is C's father. E is B's son. How is D related to E?",
    opts: ["Great-grandfather", "Grandfather", "Uncle", "Father"],
    ans: 0,
    sol: "A and B are brothers. C is their mother. D is C's father (Grandfather of A and B). E is B's son. Therefore, D is the great-grandfather of E."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?",
    opts: ["Sister of father-in-law", "Aunt", "Mother-in-law", "Sister-in-law"],
    ans: 0,
    sol: "The brother of the man's wife is the man's brother-in-law. The son of the lady's brother is the man's brother-in-law. This means the lady's brother is the father-in-law of the man. Therefore, the lady is the sister of the man's father-in-law."
  },
  {
    cat: "Logical Reasoning",
    q: "A prisoner introduced a boy who came to visit him as: 'Brothers and sisters I have none, but this boy's father is my father's son.' Who is the boy?",
    opts: ["The prisoner's son", "The prisoner's father", "The prisoner's nephew", "The prisoner's brother"],
    ans: 0,
    sol: "Since the prisoner has no siblings, 'my father's son' must be the prisoner himself. Since the boy's father is the prisoner himself, the boy is the prisoner's son."
  },
  {
    cat: "Logical Reasoning",
    q: "If A + B means A is the daughter of B; A * B means A is the son of B; and A - B means A is the wife of B. What does P * Q - R mean?",
    opts: ["R is the father of P", "R is the son of P", "R is the uncle of P", "R is the brother of P"],
    ans: 0,
    sol: "Q - R means Q is the wife of R (R is the husband, hence father of Q's children). P * Q means P is the son of Q. Therefore, P is the son of R, and R is the father of P."
  },
  {
    cat: "Logical Reasoning",
    q: "A woman walking with a boy meets another woman and is asked about her relationship with the boy. She replies, 'My maternal uncle and his maternal uncle's maternal uncle are brothers.' How is the boy related to the woman?",
    opts: ["Son", "Nephew", "Brother-in-law", "Grandson"],
    ans: 0,
    sol: "The woman's maternal uncle and the boy's maternal uncle's maternal uncle are brothers. This implies that the boy's maternal uncle is the woman's brother, making the boy the woman's son."
  },
  {
    cat: "Logical Reasoning",
    q: "Q's mother is the sister of P and daughter of M. S is the daughter of P and sister of T. How is M related to T?",
    opts: ["Grandmother or Grandfather", "Mother", "Aunt", "Sister"],
    ans: 0,
    sol: "Q's mother is sister of P, so P and Q's mother are siblings. Both are children of M. S is the daughter of P and sister of T, so T is also the child of P. M is the parent of P, so M is the grandparent of T (Grandmother or Grandfather)."
  },
  {
    cat: "Logical Reasoning",
    q: "A, B, and C are siblings. A is the brother of B. B is the sister of C. D is the mother of A. How is D related to C?",
    opts: ["Mother", "Aunt", "Grandmother", "Sister"],
    ans: 0,
    sol: "A, B, and C are siblings. If D is the mother of A, D must be the mother of all three siblings, including C."
  },
  {
    cat: "Logical Reasoning",
    q: "If 'P @ Q' means P is the wife of Q; 'P # Q' means P is the father of Q; 'P $ Q' means P is the brother of Q. Which of the following expressions indicates that A is the aunt of C?",
    opts: ["A $ B @ D # C", "A @ B $ D # C", "A # B @ D $ C", "A $ B # D @ C"],
    ans: 0,
    sol: "A $ B means A is the sister/brother (or if A is sister, but here brother/sister of B). If B @ D, B is the wife of D. D # C, D is the father of C. So B is C's mother. Since A is the sibling of B (the mother), A is C's aunt (assuming A is female, or uncle/aunt)."
  },
  {
    cat: "Logical Reasoning",
    q: "A man's wife, his mother, and his daughter are sitting in a room. A guest asks him how the three ladies are related to each other. He replies: 'My mother is the mother of my wife's sister-in-law.' How is the daughter related to the mother?",
    opts: ["Granddaughter", "Daughter", "Niece", "Sister"],
    ans: 0,
    sol: "The sister-in-law of the man's wife is the man's sister. The mother of the man's sister is the man's mother. The man's daughter is the granddaughter of the man's mother."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    opts: ["Mother", "Sister", "Grandmother", "Aunt"],
    ans: 0,
    sol: "The only daughter of the woman's mother is the woman herself. Since this daughter is the man's mother, the woman is the mother of the man."
  },
  {
    cat: "Logical Reasoning",
    q: "If D is the brother of B, B is the sister of C, and C is the father of A, how is A related to D?",
    opts: ["Nephew or Niece", "Uncle", "Brother", "Cousin"],
    ans: 0,
    sol: "D and B are siblings of C. C is the father of A. So D is the uncle of A, and A is the nephew or niece of D."
  },
  {
    cat: "Logical Reasoning",
    q: "P is the father of Q's son. R is the brother of P. S is the mother of Q. How is R related to Q?",
    opts: ["Brother-in-law", "Brother", "Husband", "Uncle"],
    ans: 0,
    sol: "P is the father of Q's son, which means P is married to Q (P is the husband, Q is the wife). R is the brother of P. Therefore, R is the brother-in-law of Q."
  },
  {
    cat: "Logical Reasoning",
    q: "Deepak said to Nitin, 'That boy playing with the football is the younger of the two brothers of the daughter of my father's wife.' How is the boy playing football related to Deepak?",
    opts: ["Brother", "Son", "Cousin", "Nephew"],
    ans: 0,
    sol: "Deepak's father's wife is Deepak's mother. Her daughter is Deepak's sister. The younger brother of Deepak's sister is Deepak's brother."
  },
  {
    cat: "Logical Reasoning",
    q: "If A + B means A is the brother of B; A * B means A is the mother of B; A - B means A is the sister of B. Which of the following means M is the maternal grandmother of T?",
    opts: ["M * K - T", "M * K * T", "M + K * T", "M * K + T"],
    ans: 1,
    sol: "M * K means M is the mother of K. K * T means K is the mother of T. Therefore, M is the mother of T's mother, i.e., maternal grandmother."
  },
  {
    cat: "Logical Reasoning",
    q: "A's mother is sister of B and has a daughter C. How can A be related to B's son?",
    opts: ["Cousin", "Uncle", "Nephew", "Brother"],
    ans: 0,
    sol: "A's mother and B are siblings. So, B's son is the cousin of A's mother's children, including A."
  },
  {
    cat: "Logical Reasoning",
    q: "Introducing a girl, Vipin said, 'Her mother is the only daughter of my mother-in-law.' How is Vipin related to the girl?",
    opts: ["Father", "Uncle", "Brother", "Husband"],
    ans: 0,
    sol: "The only daughter of Vipin's mother-in-law is Vipin's wife. Since the girl's mother is Vipin's wife, Vipin is the girl's father."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a man, a lady says, 'He is the son of my grandmother's only child.' How is the lady related to the man?",
    opts: ["Sister", "Mother", "Cousin", "Aunt"],
    ans: 0,
    sol: "The lady's grandmother's only child is the lady's mother/father. The son of the lady's parent is the lady's brother. Thus, the lady is the man's sister."
  },
  {
    cat: "Logical Reasoning",
    q: "If M is the sister of N, N is the brother of O, and O is the son of P, how is P related to M?",
    opts: ["Father or Mother", "Brother", "Uncle", "Grandfather"],
    ans: 0,
    sol: "M, N, and O are siblings. O is P's son, so P is the parent (father or mother) of M, N, and O."
  },
  {
    cat: "Logical Reasoning",
    q: "A is B's wife's husband's brother. How is A related to B?",
    opts: ["Brother", "Brother-in-law", "Cousin", "Uncle"],
    ans: 0,
    sol: "B's wife's husband is B himself. B's brother is A. So A is B's brother."
  },
  {
    cat: "Logical Reasoning",
    q: "P is the brother of Q. R is the mother of Q. S is the father of R. T is the mother of S. How is P related to T?",
    opts: ["Great-grandson", "Grandson", "Son", "Father"],
    ans: 0,
    sol: "P and Q are brothers. R is their mother. S is R's father (Grandfather of P and Q). T is S's mother (Great-grandmother of P and Q). Therefore, P is the great-grandson of T."
  },
  {
    cat: "Logical Reasoning",
    q: "Anil introduces Rohit as the son of the only brother of his father's wife. How is Rohit related to Anil?",
    opts: ["Cousin", "Brother", "Uncle", "Nephew"],
    ans: 0,
    sol: "Anil's father's wife is Anil's mother. Her only brother is Anil's maternal uncle. The son of Anil's maternal uncle is Anil's cousin."
  },
  {
    cat: "Logical Reasoning",
    q: "A is the father of B. C is the daughter of B. D is the brother of B. E is the son of A. What is the relation between C and E?",
    opts: ["Niece and Uncle", "Cousin and Cousin", "Sister and Brother", "Granddaughter and Grandfather"],
    ans: 0,
    sol: "A is the father of B, D, and E. C is the daughter of B. Since E is B's brother, E is the uncle of C. So, C is the niece of E, and E is the uncle of C."
  },
  {
    cat: "Logical Reasoning",
    q: "If A + B means A is the father of B; A - B means A is the wife of B; A * B means A is the brother of B. Which of the following means P is the sister-in-law of R?",
    opts: ["P - Q * R", "P * Q - R", "P - Q + R", "P + Q - R"],
    ans: 0,
    sol: "P - Q means P is the wife of Q. Q * R means Q is the brother of R. Since P is married to R's brother Q, P is R's sister-in-law."
  },
  {
    cat: "Logical Reasoning",
    q: "Pointing to a man, a woman said, 'His brother's father is the only son of my grandfather.' How is the woman related to the man?",
    opts: ["Sister", "Mother", "Aunt", "Daughter"],
    ans: 0,
    sol: "The man's brother's father is also the man's father. The only son of the woman's grandfather is the woman's father. Since they share the same father, the woman is the man's sister."
  },
  {
    cat: "Logical Reasoning",
    q: "C is the sister of B. A is the father of C. D is the mother of A. How is B related to D?",
    opts: ["Grandson or Granddaughter", "Son", "Brother", "Cousin"],
    ans: 0,
    sol: "A is the father of B and C. D is the mother of A. So D is the grandmother of B, meaning B is either D's grandson or granddaughter."
  },
  {
    cat: "Logical Reasoning",
    q: "If X is the brother of the son of Y's son, how is X related to Y?",
    opts: ["Grandson", "Son", "Cousin", "Uncle"],
    ans: 0,
    sol: "Y's son's son is Y's grandson. Since X is the brother of Y's grandson, X must also be Y's grandson."
  },

  // ==================== DIRECTION SENSE (25 questions) ====================
  {
    cat: "Logical Reasoning",
    q: "A man walks 6 km South, turns left and walks 4 km, then turns left again and walks 5 km. Which direction is he facing now?",
    opts: ["North", "South", "East", "West"],
    ans: 0,
    sol: "Starting facing South, he walks 6 km. Turning left makes him face East. Walking 4 km and turning left makes him face North. Thus, he is facing North."
  },
  {
    cat: "Logical Reasoning",
    q: "Karan walks 10 m East, then turns right and walks 5 m. He turns right again and walks 10 m. How far is he from the starting point?",
    opts: ["5 m", "10 m", "15 m", "20 m"],
    ans: 0,
    sol: "Walking 10 m East, turning right and walking 5 m leads him 5 m South. Turning right and walking 10 m West brings him back to the starting longitude, but 5 m South of the origin. So he is exactly 5 m from the start."
  },
  {
    cat: "Logical Reasoning",
    q: "Starting from his house, a boy walks 4 km West, then turns North and walks 3 km. What is the shortest distance back to his house?",
    opts: ["5 km", "7 km", "1 km", "12 km"],
    ans: 0,
    sol: "By Pythagoras theorem, shortest distance = sqrt(4^2 + 3^2) = sqrt(16 + 9) = sqrt(25) = 5 km."
  },
  {
    cat: "Logical Reasoning",
    q: "A watch reads 4:30. If the minute hand points East, in which direction will the hour hand point?",
    opts: ["North-East", "South-East", "North-West", "South-West"],
    ans: 0,
    sol: "At 4:30, the minute hand is at 6 (pointing South in normal layout) and the hour hand is between 4 and 5 (pointing South-East). If South is rotated to East, then South-East rotates to North-East."
  },
  {
    cat: "Logical Reasoning",
    q: "A child is looking for his father. He went 90 m in the East before turning to his right. He went 20 m before turning to his right again to look for his father at his uncle's place 30 m from this point. His father was not there. From here he went 100 m to the North before meeting his father in a street. How far did the son meet his father from the starting point?",
    opts: ["100 m", "80 m", "140 m", "260 m"],
    ans: 0,
    sol: "Horizontal displacement = 90 - 30 = 60 m. Vertical displacement = -20 + 100 = 80 m. Shortest distance = sqrt(60^2 + 80^2) = 100 m."
  },
  {
    cat: "Logical Reasoning",
    q: "One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was he facing?",
    opts: ["South", "East", "West", "North"],
    ans: 0,
    sol: "In the morning, the sun is in the East, so shadows fall towards the West. If the shadow falls to Suresh's right, West is Suresh's right. Therefore, Suresh is facing South."
  },
  {
    cat: "Logical Reasoning",
    q: "A man walks 30 m South, then turns left and walks 40 m. Then he turns left again and walks 30 m. Which direction is he from the starting point?",
    opts: ["East", "West", "North", "South"],
    ans: 0,
    sol: "30 m South, then 40 m East, and then 30 m North. The North-South movements cancel out, leaving him 40 m East of the starting point."
  },
  {
    cat: "Logical Reasoning",
    q: "Gita starts walking from a point and goes 2 km North, then turns to her right and walks 2 km, then turns to her right again and walks. Which direction is she facing now?",
    opts: ["South", "East", "North", "West"],
    ans: 0,
    sol: "Gita goes North, turns right to face East, and turns right again to face South."
  },
  {
    cat: "Logical Reasoning",
    q: "If South-East becomes North, North-East becomes West and so on, what will West become?",
    opts: ["South-East", "North-West", "North-East", "South-West"],
    ans: 0,
    sol: "South-East (normally 135 deg clockwise) becomes North (0 deg). This is a rotation of 135 degrees counter-clockwise. West (270 deg) rotated 135 deg CCW becomes South-East (135 deg)."
  },
  {
    cat: "Logical Reasoning",
    q: "A person starts walking in the morning facing the Sun. After some time, he turns to his left, and later turns to his left again. Which direction is he facing now?",
    opts: ["West", "East", "North", "South"],
    ans: 0,
    sol: "Morning sun is in the East. Facing sun means starting East. Turn left to face North. Turn left again to face West."
  },
  {
    cat: "Logical Reasoning",
    q: "Deepa starts walking towards the North. After walking 30 m, she turns left and walks 15 m. She then turns left and walks 30 m. How far is she from her starting point?",
    opts: ["15 m", "30 m", "45 m", "0 m"],
    ans: 0,
    sol: "Deepa goes 30 m North, 15 m West, and 30 m South. The North-South movements cancel out, leaving her 15 m West of the start point."
  },
  {
    cat: "Logical Reasoning",
    q: "A man travels 4 miles North, 3 miles East, and then 4 miles North. How far is he from his starting point?",
    opts: ["8.54 miles", "11 miles", "5 miles", "8 miles"],
    ans: 0,
    sol: "Total vertical movement = 4 + 4 = 8 miles North. Horizontal movement = 3 miles East. Shortest distance = sqrt(8^2 + 3^2) = sqrt(73) ≈ 8.54 miles."
  },
  {
    cat: "Logical Reasoning",
    q: "Rohan walks 20 m North. Then he turns right and walks 30 m. Then he turns right and walks 35 m. Then he turns left and walks 15 m. Finally he turns left and walks 15 m. In which direction and how far is he from the starting point?",
    opts: ["45 m East", "30 m East", "45 m West", "30 m West"],
    ans: 0,
    sol: "Vertical steps: +20 - 35 + 15 = 0 m. Horizontal steps: +30 + 15 = 45 m. So he is 45 m East of the starting point."
  },
  {
    cat: "Logical Reasoning",
    q: "A man is facing West. He turns 45 degrees clockwise, then another 180 degrees in the same direction, and then 270 degrees anti-clockwise. Which direction is he facing now?",
    opts: ["South-West", "North-West", "South-East", "North-East"],
    ans: 0,
    sol: "Initial = West (270 deg). Clockwise turns: +45 + 180 = +225 deg. Anti-clockwise turn: -270 deg. Net change = +225 - 270 = -45 deg (anti-clockwise). West turned 45 deg anti-clockwise (left) is South-West."
  },
  {
    cat: "Logical Reasoning",
    q: "If you walk 10 km towards North, turn right and walk 5 km, then turn right and walk 10 km, what is the distance between your starting and ending position?",
    opts: ["5 km", "10 km", "15 km", "20 km"],
    ans: 0,
    sol: "The North-South movements (10 km North and 10 km South) cancel out. Only the 5 km East movement remains, so the distance is 5 km."
  },
  {
    cat: "Logical Reasoning",
    q: "A boy goes 5 km East, turns right and goes 12 km. What is the shortest distance back to his starting point?",
    opts: ["13 km", "17 km", "7 km", "15 km"],
    ans: 0,
    sol: "Shortest distance = sqrt(5^2 + 12^2) = sqrt(25 + 144) = sqrt(169) = 13 km."
  },
  {
    cat: "Logical Reasoning",
    q: "A girl is standing facing South. She turns 90 degrees anti-clockwise, walks 5 m, then turns right and walks 10 m, then turns right again and walks 5 m. How far is she from the starting point?",
    opts: ["10 m", "5 m", "15 m", "20 m"],
    ans: 0,
    sol: "Facing South, turning 90 deg CCW makes her face East. She walks 5 m East, turns right to face South, walks 10 m South, turns right to face West, walks 5 m West. The East-West movements cancel, leaving her 10 m South of the starting point."
  },
  {
    cat: "Logical Reasoning",
    q: "A river flows West to East. On the way, it turns left and goes in a semi-circle round a hill, and then turns left at right angles. In which direction is the river flowing finally?",
    opts: ["North", "South", "East", "West"],
    ans: 0,
    sol: "The river starts flowing East. Turns left to face North. Goes in a semi-circle round a hill, ending up facing South. Then turns left at right angles, which makes it face East again."
  },
  {
    cat: "Logical Reasoning",
    q: "A man walks 2 km North, then turns East and walks 10 km. After this, he turns North and walks 3 km, and then turns East and walks 2 km. How far is he from the starting point?",
    opts: ["13 km", "15 km", "17 km", "12 km"],
    ans: 0,
    sol: "Total North movement = 2 + 3 = 5 km. Total East movement = 10 + 2 = 12 km. Shortest distance = sqrt(5^2 + 12^2) = 13 km."
  },
  {
    cat: "Logical Reasoning",
    q: "Two cars start from opposite points of a 150 km long highway. Car A goes for 25 km, turns right and goes 15 km, then turns left and goes 25 km, and then turns back to reach the main highway. Meanwhile, Car B goes 35 km straight along the highway. What is the distance between the two cars now?",
    opts: ["65 km", "55 km", "75 km", "85 km"],
    ans: 0,
    sol: "Car A traveled 25 km + 25 km = 50 km along the highway. Car B traveled 35 km from the opposite side. Total highway distance = 150 km. Distance between them = 150 - (50 + 35) = 65 km."
  },
  {
    cat: "Logical Reasoning",
    q: "From a point, Amit walks 10 m North, then 10 m East, then 10 m South. In which direction is he now with respect to his starting point?",
    opts: ["East", "West", "North", "South"],
    ans: 0,
    sol: "10 m North and 10 m South cancel out. He is 10 m East of the starting point."
  },
  {
    cat: "Logical Reasoning",
    q: "Starting from a point, Raju walked 15 m towards North. He turned left and walked 10 m. Then he turned left and walked 15 m. How far and in which direction is he from the starting point?",
    opts: ["10 m West", "10 m East", "15 m West", "15 m East"],
    ans: 0,
    sol: "Raju went 15 m North, 10 m West, and 15 m South. The vertical movements cancel, leaving him 10 m West of the start point."
  },
  {
    cat: "Logical Reasoning",
    q: "If East is replaced by North-East, West is replaced by South-West and so on, what will North-West be replaced by?",
    opts: ["North", "South", "East", "West"],
    ans: 0,
    sol: "East (90 deg) is replaced by North-East (45 deg) - a CCW rotation of 45 degrees. Thus, North-West (315 deg) rotated 45 deg CCW becomes North (360/0 deg)."
  },
  {
    cat: "Logical Reasoning",
    q: "A person travels 12 km North, then 5 km East, then 6 km South. How far is he from the starting point?",
    opts: ["7.81 km", "11 km", "13 km", "10 km"],
    ans: 0,
    sol: "Vertical distance = 12 - 6 = 6 km North. Horizontal distance = 5 km East. Shortest distance = sqrt(6^2 + 5^2) = sqrt(61) ≈ 7.81 km."
  },
  {
    cat: "Logical Reasoning",
    q: "A man is walking towards the South. He turns right, then left, and then right. Which direction is he facing now?",
    opts: ["West", "South", "East", "North"],
    ans: 0,
    sol: "Facing South, he turns right (faces West), then left (faces South), and then right (faces West)."
  },

  // ==================== ODD ONE OUT (25 questions) ====================
  {
    cat: "Logical Reasoning",
    q: "Identify the odd one out among the following operating systems:",
    opts: ["Apache", "macOS", "Linux", "Windows"],
    ans: 0,
    sol: "Apache is a web server software, while macOS, Linux, and Windows are operating systems."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd one out from these programming tools:",
    opts: ["Docker", "Visual Studio", "PyCharm", "Eclipse"],
    ans: 0,
    sol: "Docker is a containerization platform, while Visual Studio, PyCharm, and Eclipse are integrated development environments (IDEs)."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd one out among these web browsers:",
    opts: ["MongoDB", "Chrome", "Safari", "Edge"],
    ans: 0,
    sol: "MongoDB is a database management system, while Chrome, Safari, and Edge are web browsers."
  },
  {
    cat: "Logical Reasoning",
    q: "Find the odd one out from the given list of protocols:",
    opts: ["HTML", "HTTP", "FTP", "SMTP"],
    ans: 0,
    sol: "HTML is a document markup language, while HTTP, FTP, and SMTP are network transmission protocols."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the term that does not belong with the others:",
    opts: ["CSS", "C++", "Java", "Python"],
    ans: 0,
    sol: "CSS is a styling language, while C++, Java, and Python are general-purpose programming languages."
  },
  {
    cat: "Logical Reasoning",
    q: "Identify the odd one out among these data structures:",
    opts: ["Git", "Stack", "Queue", "Linked List"],
    ans: 0,
    sol: "Git is a version control system, while Stack, Queue, and Linked List are linear data structures."
  },
  {
    cat: "Logical Reasoning",
    q: "Which of the following is the odd one out?",
    opts: ["Kubernetes", "JSON", "XML", "YAML"],
    ans: 0,
    sol: "Kubernetes is a container orchestration tool, while JSON, XML, and YAML are text data serialization formats."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd term from the list:",
    opts: ["Vite", "Procedural", "Object-Oriented", "Functional"],
    ans: 0,
    sol: "Vite is a frontend build tool, while Procedural, Object-Oriented, and Functional are programming paradigms."
  },
  {
    cat: "Logical Reasoning",
    q: "Find the odd one out among these cryptographic terms:",
    opts: ["SQL Injection", "AES", "DES", "RSA"],
    ans: 0,
    sol: "SQL Injection is a web application security exploit, while AES, DES, and RSA are cryptographic encryption algorithms."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd one out among these cloud providers:",
    opts: ["MySQL", "AWS", "Google Cloud", "Microsoft Azure"],
    ans: 0,
    sol: "MySQL is an open-source relational database, while AWS, Google Cloud, and Azure are major cloud infrastructure platforms."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd one out among these hardware items:",
    opts: ["Python Interpreter", "Hard Disk", "SSD", "RAM"],
    ans: 0,
    sol: "Python Interpreter is software, while Hard Disk, SSD, and RAM are computer hardware devices."
  },
  {
    cat: "Logical Reasoning",
    q: "Identify the odd word out from this set:",
    opts: ["Compiler", "Algorithm", "Flowchart", "Pseudocode"],
    ans: 0,
    sol: "Compiler is a system utility software, while Algorithm, Flowchart, and Pseudocode are design representations of logic."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd one out among these number series:",
    opts: ["225", "8", "27", "64"],
    ans: 0,
    sol: "8 (2^3), 27 (3^3), and 64 (4^3) are perfect cubes, while 225 (15^2) is a perfect square."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd term among these network components:",
    opts: ["DNS Query", "Router", "Switch", "Hub"],
    ans: 0,
    sol: "DNS Query is a request message, while Router, Switch, and Hub are physical network hardware devices."
  },
  {
    cat: "Logical Reasoning",
    q: "Find the odd one out among these security protocols:",
    opts: ["Ransomware", "SSL", "TLS", "HTTPS"],
    ans: 0,
    sol: "Ransomware is malicious software, while SSL, TLS, and HTTPS are secure network protocols."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd term from these internet components:",
    opts: ["SQL Server", "IP Address", "MAC Address", "Domain Name"],
    ans: 0,
    sol: "SQL Server is database software, while IP Address, MAC Address, and Domain Name are addressing and naming identifiers."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd one out from these languages:",
    opts: ["Markdown", "C", "C++", "Java"],
    ans: 0,
    sol: "Markdown is a markup language for formatting text, while C, C++, and Java are compiled programming languages."
  },
  {
    cat: "Logical Reasoning",
    q: "Identify the odd term among these system architecture terms:",
    opts: ["Git Commit", "Monolith", "Microservices", "Serverless"],
    ans: 0,
    sol: "Git Commit is a version control action, while Monolith, Microservices, and Serverless are software system architectures."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd word out from this hardware list:",
    opts: ["Linux Kernel", "Keyboard", "Mouse", "Monitor"],
    ans: 0,
    sol: "Linux Kernel is core operating system software, while Keyboard, Mouse, and Monitor are peripheral hardware input/output devices."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd one out from these software engineering methodologies:",
    opts: ["Node.js", "Agile", "Scrum", "Waterfall"],
    ans: 0,
    sol: "Node.js is a JavaScript runtime environment, while Agile, Scrum, and Waterfall are software project management methodologies."
  },
  {
    cat: "Logical Reasoning",
    q: "Find the odd one out from these storage concepts:",
    opts: ["API Endpoint", "Relational Database", "Key-Value Store", "Document Store"],
    ans: 0,
    sol: "API Endpoint is a web access address, while Relational, Key-Value, and Document stores are database persistence formats."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd one out from these programming variables:",
    opts: ["HTML Page", "Integer", "String", "Boolean"],
    ans: 0,
    sol: "HTML Page is a document asset, while Integer, String, and Boolean are core programming data types."
  },
  {
    cat: "Logical Reasoning",
    q: "Select the odd term among these version control terms:",
    opts: ["Docker Container", "Git Push", "Git Pull", "Git Merge"],
    ans: 0,
    sol: "Docker Container is a packaged software environment, while Git Push, Pull, and Merge are source control command operations."
  },
  {
    cat: "Logical Reasoning",
    q: "Identify the odd one out from these web styling terms:",
    opts: ["Express.js", "CSS Grid", "Flexbox", "Bootstrap"],
    ans: 0,
    sol: "Express.js is a backend Node.js framework, while CSS Grid, Flexbox, and Bootstrap are frontend visual styling systems."
  },
  {
    cat: "Logical Reasoning",
    q: "Choose the odd one out from these sorting algorithms:",
    opts: ["Linear Search", "Bubble Sort", "Quick Sort", "Merge Sort"],
    ans: 0,
    sol: "Linear Search is a search algorithm, while Bubble, Quick, and Merge are sorting algorithms."
  },

  // ==================== SYLLOGISMS & LOGICAL STATEMENTS (30 questions) ====================
  {
    cat: "Logical Reasoning",
    q: "Statements: All roses are flowers. Some flowers are red. Conclusions: I. All roses are red. II. Some flowers are roses.",
    opts: ["Only II follows", "Only I follows", "Both I and II follow", "Neither I nor II follows"],
    ans: 0,
    sol: "Since all roses are flowers, it means 'some flowers are roses' is definitely true. However, 'all roses are red' is not necessarily true because roses and red things only intersect through some flowers."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some functions are parameters. Some parameters are arguments. Conclusions: I. Some functions are arguments. II. No parameter is a function.",
    opts: ["Neither I nor II follows", "Only I follows", "Only II follows", "Both follow"],
    ans: 0,
    sol: "Functions and arguments do not necessarily intersect. And since some functions are parameters, the statement 'no parameter is a function' is false. Hence, neither follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some software are applications. All applications are tools. Conclusions: I. All software are tools. II. Some software are tools.",
    opts: ["Only II follows", "Only I follows", "Both I and II follow", "Neither I nor II follows"],
    ans: 0,
    sol: "Since some software are applications and all applications are tools, the software that are applications must be tools. Therefore, some software are tools. All software are tools is not guaranteed."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No loops are infinite. Some loops are recursive. Conclusions: I. Some recursive are not infinite. II. No recursive are infinite.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since some loops are recursive and no loops are infinite, those recursive loops cannot be infinite. Thus, some recursive are not infinite follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All servers are local. No local is remote. Conclusions: I. Some servers are remote. II. No server is remote.",
    opts: ["Only II follows", "Only I follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "All servers are subsets of local. No local is remote. Thus, no server can be remote. Only II follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All codes are bugs. All bugs are issues. Conclusions: I. All codes are issues. II. All issues are codes.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Codes are a subset of bugs, and bugs are a subset of issues. Thus, all codes are issues. The reverse does not necessarily follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All engineers are professionals. Some professionals are teachers. Conclusions: I. Some engineers are teachers. II. Some teachers are professionals.",
    opts: ["Only II follows", "Only I follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since some professionals are teachers, it follows that some teachers are professionals. There is no direct link to prove some engineers are teachers. Only II follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some keys are locks. Some locks are doors. Conclusions: I. Some keys are doors. II. No key is a door.",
    opts: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "There is no direct connection between keys and doors. However, either there is an intersection (Some keys are doors) or there is not (No key is a door). Thus, either I or II follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No printer is scanner. All scanners are copiers. Conclusions: I. Some copiers are scanners. II. No copier is printer.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "All scanners are copiers, so some copiers are scanners follows. However, some copiers (those which are not scanners) might be printers, so No copier is printer does not necessarily follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All scripts are files. No file is folder. Conclusions: I. No script is folder. II. Some folders are scripts.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since all scripts are files and no file is a folder, no script can be a folder. Thus, I follows and II is false."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some databases are relational. All databases are structured. Conclusions: I. Some structured are relational. II. All structured are databases.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since all databases are structured and some databases are relational, those databases that are relational must be structured. Hence, some structured are relational. Not all structured are databases."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All programmers write code. No coder is lazy. (Assume coders refers to programmers). Conclusions: I. No programmer is lazy. II. Some lazy people do not write code.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "All programmers are coders. Since no coder is lazy, no programmer is lazy. Since programmers write code and no programmer is lazy, some people who write code are not lazy, which implies some lazy people do not write code (or it follows from the negative relation)."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some networks are secure. Some secure are fast. Conclusions: I. Some networks are fast. II. No network is fast.",
    opts: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Since networks and fast only relate through secure, their intersection is undefined. Thus, either they intersect (Some networks are fast) or they do not (No network is fast)."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All websites are public. All public are accessible. Conclusions: I. All websites are accessible. II. Some accessible are websites.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Websites is a subset of public, which is a subset of accessible. So all websites are accessible, and some accessible are websites."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No software is hardware. No hardware is firmware. Conclusions: I. No software is firmware. II. Some software is firmware.",
    opts: ["Neither I nor II follows", "Only I follows", "Only II follows", "Either I or II follows"],
    ans: 0,
    sol: "No software is hardware and no hardware is firmware does not tell us anything about the relation between software and firmware. They could intersect or not. Neither follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All users are administrators. Some administrators are developers. Conclusions: I. Some users are developers. II. No user is developer.",
    opts: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Since users are a subset of administrators, and some administrators are developers, the intersection of users and developers is unknown. Thus, either they intersect or they do not."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All algorithms are steps. No steps are endless. Conclusions: I. No algorithm is endless. II. Some steps are algorithms.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Since all algorithms are steps and no steps are endless, no algorithm can be endless. And since all algorithms are steps, some steps must be algorithms."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some files are corrupted. All corrupted are unusable. Conclusions: I. Some usable are files. II. Some unusable are files.",
    opts: ["Only II follows", "Only I follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since some files are corrupted and all corrupted are unusable, those files that are corrupted must be unusable. Thus, some unusable are files. Nothing is said about usable files."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No input is output. No output is error. Conclusions: I. Some input is error. II. No input is error.",
    opts: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Inputs and errors are only defined by their negative relationship with outputs. Thus, their intersection is undefined. Either they intersect or they do not."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All trees are plants. All plants are living. Conclusions: I. All trees are living. II. Some living are plants.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Trees are subset of plants, which is subset of living. Hence all trees are living, and since plants are subset of living, some living are plants."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some books are novels. All novels are fiction. Conclusions: I. Some books are fiction. II. No novels are fiction.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since some books are novels and all novels are fiction, those books that are novels must be fiction. Thus, some books are fiction. II contradicts the statement."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All laptops are computers. No computers are analog. Conclusions: I. No laptops are analog. II. Some computers are laptops.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Laptops are a subset of computers. Since no computers are analog, no laptops are analog. Since all laptops are computers, some computers must be laptops."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some variables are integers. Some integers are floats. Conclusions: I. Some variables are floats. II. No variables are floats.",
    opts: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Variables and floats only intersect through integers. Thus, their relationship is undefined. Either they intersect or they do not."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All networks are topologies. Some topologies are rings. Conclusions: I. Some networks are rings. II. Some rings are topologies.",
    opts: ["Only II follows", "Only I follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since some topologies are rings, some rings must be topologies. There is no proof connecting networks to rings. Only II follows."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All developers are creative. No developer is dull. Conclusions: I. Some creative are developers. II. No creative is dull.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Since all developers are creative, some creative are developers. However, there might be creative people who are not developers and who are dull, so No creative is dull is not necessarily true."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No request is response. All responses are messages. Conclusions: I. Some messages are responses. II. No message is request.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "All responses are messages, so some messages are responses. Some messages (those which are not responses) could be requests, so No message is request does not follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All objects are instances. All instances are classes. Conclusions: I. All objects are classes. II. All classes are objects.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Objects are subset of instances, which are subset of classes. Thus all objects are classes. The reverse does not necessarily follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: Some servers are cloud. All cloud are virtual. Conclusions: I. Some servers are virtual. II. All virtual are cloud.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "Some servers are cloud and all cloud are virtual, so those servers that are cloud must be virtual. Thus, some servers are virtual follows. II does not follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: No function is inline. All inline are macros. Conclusions: I. Some macros are inline. II. No macro is function.",
    opts: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
    ans: 0,
    sol: "All inline are macros, so some macros are inline follows. Some macros (not inline) could be functions, so No macro is function does not follow."
  },
  {
    cat: "Logical Reasoning",
    q: "Statements: All arrays are lists. No lists are hashes. Conclusions: I. No array is hash. II. Some lists are arrays.",
    opts: ["Both I and II follow", "Only I follows", "Only II follows", "Neither follows"],
    ans: 0,
    sol: "Arrays are subset of lists. Since no lists are hashes, no array can be a hash. Since all arrays are lists, some lists are arrays."
  }
];

// Read existing questionBank.js
const qbPath = path.resolve('src/data/questionBank.js');
let fileContent = fs.readFileSync(qbPath, 'utf8');

// Parse the current array
// Since the file contains `export const QB = [ ... ];` and `export const CATEGORY_CONFIG = [ ... ];`,
// let's evaluate or extract the arrays. To do it safely and without eval issues,
// we can extract the text inside QB = [ ... ] using regex or custom parsing,
// or we can just import the module using node and run the merge, then generate the file structure.
// Let's do it by loading the module dynamically.
// Since package.json has "type": "module", we can import it directly!

async function run() {
  const m = await import('../src/data/questionBank.js');
  let currentQB = m.QB;
  
  // Filter out any of the newly generated questions if they already exist, to avoid duplicates.
  // We can merge them.
  console.log("Current QB size:", currentQB.length);
  
  // Keep existing questions but let's see which ones are Logical Reasoning.
  // We have 211 Logical Reasoning questions. We want to ADD the new questions to them.
  // Let's assign temporary IDs to new questions
  let lastId = Math.max(...currentQB.map(q => q.id));
  console.log("Last ID in current database:", lastId);
  
  const enrichedNewQuestions = newQuestions.map((q, idx) => {
    return {
      ...q,
      id: lastId + 1 + idx
    };
  });
  
  const mergedQB = [...currentQB, ...enrichedNewQuestions];
  console.log("Merged QB size:", mergedQB.length);
  
  // Let's re-sequence all IDs from 1 to mergedQB.length to keep the database tidy
  const finalizedQB = mergedQB.map((q, idx) => {
    return {
      ...q,
      id: idx + 1
    };
  });
  
  // Now write back to questionBank.js
  const outputCode = `// Aptitude Mock Test Question Bank
// Total Questions: ${finalizedQB.length}

export const QB = ${JSON.stringify(finalizedQB, null, 2)};

export const CATEGORY_CONFIG = ${JSON.stringify(m.CATEGORY_CONFIG, null, 2)};
`;

  fs.writeFileSync(qbPath, outputCode, 'utf8');
  console.log("Successfully wrote updated questionBank.js. New total questions:", finalizedQB.length);
}

run().catch(console.error);
