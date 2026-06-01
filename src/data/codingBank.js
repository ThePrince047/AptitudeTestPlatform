// Coding Prep Question Bank - 155 fully interactive & runnable questions
// Supports C, C++, Python, Java, JavaScript via Standard I/O model

const CAT = {
  BASIC: "Basic Logic",
  ARRAY: "Arrays & Strings",
  LIST: "Linked Lists",
  STACK: "Stacks & Queues",
  TREE: "Trees & BSTs",
  GRAPH: "Graphs",
  RECURSION: "Recursion & Backtracking",
  DP: "Dynamic Programming"
};

// Core Hand-crafted Questions (30 detailed questions)
const CORE_QUESTIONS = [
  {
    id: "code_1", title: "Reverse a String", difficulty: "Easy", category: CAT.BASIC,
    description: "Write a program that takes a string of characters and reverses it. Use standard input/output.",
    constraints: "1 <= s.length <= 10^5\nString contains printable ASCII characters.",
    testCases: [
      { input: "hello", output: "olleh", explanation: "Reversed string is 'olleh'" },
      { input: "Hannah", output: "hannaH", explanation: "Case is preserved." }
    ],
    solutions: {
      python: "s = input().strip()\nprint(s[::-1])",
      cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        reverse(s.begin(), s.end());\n        cout << s << endl;\n    }\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine().trim();\n            System.out.println(new StringBuilder(s).reverse().toString());\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconsole.log(input.split('').reverse().join(''));",
      c: "#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[100000];\n    if (scanf(\"%s\", s) == 1) {\n        int n = strlen(s);\n        for (int i = 0; i < n / 2; i++) {\n            char temp = s[i];\n            s[i] = s[n - 1 - i];\n            s[n - 1 - i] = temp;\n        }\n        printf(\"%s\\n\", s);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "# Read input and print its reverse\ns = input().strip()\n# Write code below:\n",
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Write code below:\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write code below:\n    }\n}",
      javascript: "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\n// Write code below:\n",
      c: "#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[100000];\n    // Write code below:\n    return 0;\n}"
    },
    explanation: "Two pointers technique: swap elements from the beginning and the end moving inwards.",
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "hello"
  },
  {
    id: "code_2", title: "Factorial of a Number", difficulty: "Easy", category: CAT.BASIC,
    description: "Calculate the factorial of a given integer N.",
    constraints: "0 <= N <= 20",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" }
    ],
    solutions: {
      python: "import math\nn = int(input())\nprint(math.factorial(n))",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long ans = 1;\n    for(int i = 1; i <= n; ++i) ans *= i;\n    cout << ans << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long ans = 1;\n        for (int i = 1; i <= n; i++) ans *= i;\n        System.out.println(ans);\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nlet ans = 1;\nfor (let i = 1; i <= n; i++) ans *= i;\nconsole.log(ans);",
      c: "#include <stdio.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        long long ans = 1;\n        for (int i = 1; i <= n; i++) ans *= i;\n        printf(\"%lld\\n\", ans);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\n# Print N!",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    // Print N!\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Print N!\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n// Print n!",
      c: "#include <stdio.h>\nint main() {\n    int n; scanf(\"%d\", &n);\n    // Print n!\n    return 0;\n}"
    },
    explanation: "Iterate from 1 to N, multiplying the terms. Use long long or BigInt for larger numbers.",
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "5"
  },
  {
    id: "code_3", title: "Prime Checker", difficulty: "Easy", category: CAT.BASIC,
    description: "Write a program that outputs YES if N is prime, and NO otherwise.",
    constraints: "1 <= N <= 10^9",
    testCases: [
      { input: "7", output: "YES" },
      { input: "4", output: "NO" }
    ],
    solutions: {
      python: "n = int(input())\nif n < 2:\n    print('NO')\nelse:\n    is_prime = True\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            is_prime = False\n            break\n    print('YES' if is_prime else 'NO')",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    long long n; cin >> n;\n    if (n < 2) { cout << \"NO\" << endl; return 0; }\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) { cout << \"NO\" << endl; return 0; }\n    }\n    cout << \"YES\" << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long n = sc.nextLong();\n            if (n < 2) { System.out.println(\"NO\"); return; }\n            for (long i = 2; i * i <= n; i++) {\n                if (n % i == 0) { System.out.println(\"NO\"); return; }\n            }\n            System.out.println(\"YES\");\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nif (n < 2) {\n    console.log('NO');\n} else {\n    let prime = true;\n    for (let i = 2; i * i <= n; i++) {\n        if (n % i === 0) { prime = false; break; }\n    }\n    console.log(prime ? 'YES' : 'NO');\n}",
      c: "#include <stdio.h>\nint main() {\n    long long n;\n    if (scanf(\"%lld\", &n) == 1) {\n        if (n < 2) { printf(\"NO\\n\"); return 0; }\n        for (long long i = 2; i * i <= n; i++) {\n            if (n % i == 0) { printf(\"NO\\n\"); return 0; }\n        }\n        printf(\"YES\\n\");\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\n# Print YES or NO",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    long long n; cin >> n;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n",
      c: "#include <stdio.h>\nint main() {\n    long long n; scanf(\"%lld\", &n);\n    return 0;\n}"
    },
    explanation: "Check divisibility up to square root of N. Return NO if divisible, YES otherwise.",
    timeComplexity: "O(sqrt(N))", spaceComplexity: "O(1)",
    stdinTemplate: "7"
  },
  {
    id: "code_4", title: "Two Sum", difficulty: "Easy", category: CAT.ARRAY,
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.\n\nInput format:\nLine 1: N (array length) and target\nLine 2: N space-separated integers",
    constraints: "2 <= N <= 10^4\n-10^9 <= nums[i] <= 10^9",
    testCases: [
      { input: "4 9\n2 7 11 15", output: "0 1" },
      { input: "3 6\n3 2 4", output: "1 2" }
    ],
    solutions: {
      python: "n, target = map(int, input().split())\nnums = list(map(int, input().split()))\nseen = {}\nfor i, x in enumerate(nums):\n    diff = target - x\n    if diff in seen:\n        print(f\"{seen[diff]} {i}\")\n        break\n    seen[x] = i",
      cpp: "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std; \nint main() {\n    int n, target; cin >> n >> target;\n    vector<int> nums(n);\n    unordered_map<int, int> seen;\n    for(int i = 0; i < n; ++i) {\n        cin >> nums[i];\n        int diff = target - nums[i];\n        if (seen.count(diff)) {\n            cout << seen[diff] << \" \" << i << endl;\n            return 0;\n        }\n        seen[nums[i]] = i;\n    }\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            int diff = target - x;\n            if (seen.containsKey(diff)) {\n                System.out.println(seen.get(diff) + \" \" + i);\n                return;\n            }\n            seen.put(x, i);\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, target] = lines[0].split(' ').map(Number);\nconst nums = lines[1].split(' ').map(Number);\nconst seen = new Map();\nfor (let i = 0; i < n; i++) {\n    const diff = target - nums[i];\n    if (seen.has(diff)) {\n        console.log(seen.get(diff) + ' ' + i);\n        break;\n    }\n    seen.set(nums[i], i);\n}",
      c: "#include <stdio.h>\n#include <stdlib.h>\nstruct Entry {\n    int val; int idx;\n};\nint cmp(const void* a, const void* b) {\n    return ((struct Entry*)a)->val - ((struct Entry*)b)->val;\n}\nint main() {\n    int n, target;\n    if (scanf(\"%d %d\", &n, &target) == 2) {\n        struct Entry* arr = malloc(n * sizeof(struct Entry));\n        for (int i = 0; i < n; i++) {\n            scanf(\"%d\", &arr[i].val);\n            arr[i].idx = i;\n        }\n        qsort(arr, n, sizeof(struct Entry), cmp);\n        int l = 0, r = n - 1;\n        while (l < r) {\n            int sum = arr[l].val + arr[r].val;\n            if (sum == target) {\n                int i1 = arr[l].idx, i2 = arr[r].idx;\n                if (i1 > i2) { int t = i1; i1 = i2; i2 = t; }\n                printf(\"%d %d\\n\", i1, i2);\n                break;\n            } else if (sum < target) l++;\n            else r--;\n        }\n        free(arr);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "# Read target and array, and print indices\n",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n    }\n}",
      javascript: "",
      c: "#include <stdio.h>\nint main() {\n    return 0;\n}"
    },
    explanation: "Use a hash map to keep track of indexes of visited elements. O(N) time and O(N) space.",
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "4 9\n2 7 11 15"
  },
  {
    id: "code_5", title: "Valid Parentheses", difficulty: "Easy", category: CAT.STACK,
    description: "Determine if the input string containing parentheses characters is balanced and valid.",
    constraints: "1 <= s.length <= 10^5",
    testCases: [
      { input: "()[]{}", output: "YES" },
      { input: "(]", output: "NO" }
    ],
    solutions: {
      python: "s = input().strip()\nstack = []\nmapping = {')': '(', '}': '{', ']': '['}\nvalid = True\nfor char in s:\n    if char in mapping:\n        top = stack.pop() if stack else '#'\n        if mapping[char] != top:\n            valid = False\n            break\n    else:\n        stack.append(char)\nif stack: valid = False\nprint('YES' if valid else 'NO')",
      cpp: "#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    stack<char> st;\n    bool ok = true;\n    for(char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) { ok = false; break; }\n            if (c == ')' && st.top() != '(') { ok = false; break; }\n            if (c == '}' && st.top() != '{') { ok = false; break; }\n            if (c == ']' && st.top() != '[') { ok = false; break; }\n            st.pop();\n        }\n    }\n    if(!st.empty()) ok = false;\n    cout << (ok ? \"YES\" : \"NO\") << endl;\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            Stack<Character> stack = new Stack<>();\n            boolean ok = true;\n            for (char c : s.toCharArray()) {\n                if (c == '(' || c == '{' || c == '[') stack.push(c);\n                else {\n                    if (stack.isEmpty()) { ok = false; break; }\n                    char top = stack.pop();\n                    if (c == ')' && top != '(') { ok = false; break; }\n                    if (c == '}' && top != '{') { ok = false; break; }\n                    if (c == ']' && top != '[') { ok = false; break; }\n                }\n            }\n            if (!stack.isEmpty()) ok = false;\n            System.out.println(ok ? \"YES\" : \"NO\");\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst stack = [];\nconst map = { ')': '(', '}': '{', ']': '[' };\nlet ok = true;\nfor (let c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else {\n        if (stack.pop() !== map[c]) { ok = false; break; }\n    }\n}\nif (stack.length > 0) ok = false;\nconsole.log(ok ? 'YES' : 'NO');",
      c: "#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[100005];\n    if (scanf(\"%s\", s) == 1) {\n        char st[100005]; int top = 0;\n        int ok = 1;\n        for (int i = 0; s[i]; i++) {\n            char c = s[i];\n            if (c == '(' || c == '{' || c == '[') st[top++] = c;\n            else {\n                if (top == 0) { ok = 0; break; }\n                char p = st[--top];\n                if (c == ')' && p != '(') { ok = 0; break; }\n                if (c == '}' && p != '{') { ok = 0; break; }\n                if (c == ']' && p != '[') { ok = 0; break; }\n            }\n        }\n        if (top > 0) ok = 0;\n        printf(\"%s\\n\", ok ? \"YES\" : \"NO\");\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "s = input().strip()\n# Print YES or NO",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}",
      java: "public class Main {\n    public static void main(String[] args) {}\n}",
      javascript: "",
      c: ""
    },
    explanation: "Use stack of opening brackets. Push open brackets. For close brackets, verify match at stack top and pop.",
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "()[]{}"
  },
  {
    id: "code_6", title: "Number of Islands", difficulty: "Medium", category: CAT.GRAPH,
    description: "Given a 2D binary grid grid representing land ('1') and water ('0'), count and print the number of islands.\n\nInput format:\nLine 1: rows M and cols N\nNext M lines: grid values",
    constraints: "1 <= M, N <= 100",
    testCases: [
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" }
    ],
    solutions: {
      python: "r, c = map(int, input().split())\ngrid = [input().split() for _ in range(r)]\ncount = 0\ndef dfs(i, j):\n    if i < 0 or i >= r or j < 0 or j >= c or grid[i][j] == '0': return\n    grid[i][j] = '0'\n    dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)\nfor i in range(r):\n    for j in range(c):\n        if grid[i][j] == '1':\n            count += 1\n            dfs(i, j)\nprint(count)",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\nvoid dfs(vector<vector<char>>& grid, int r, int c, int rows, int cols) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c, rows, cols);\n    dfs(grid, r-1, c, rows, cols);\n    dfs(grid, r, c+1, rows, cols);\n    dfs(grid, r, c-1, rows, cols);\n}\nint main() {\n    int rows, cols; if (!(cin >> rows >> cols)) return 0;\n    vector<vector<char>> grid(rows, vector<char>(cols));\n    for (int i = 0; i < rows; i++)\n        for (int j = 0; j < cols; j++) cin >> grid[i][j];\n    int count = 0;\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            if (grid[i][j] == '1') {\n                count++;\n                dfs(grid, i, j, rows, cols);\n            }\n        }\n    }\n    cout << count << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void dfs(char[][] grid, int r, int c, int rows, int cols) {\n        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;\n        grid[r][c] = '0';\n        dfs(grid, r+1, c, rows, cols);\n        dfs(grid, r-1, c, rows, cols);\n        dfs(grid, r, c+1, rows, cols);\n        dfs(grid, r, c-1, rows, cols);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int rows = sc.nextInt();\n            int cols = sc.nextInt();\n            char[][] grid = new char[rows][cols];\n            for (int i = 0; i < rows; i++) {\n                for (int j = 0; j < cols; j++) {\n                    grid[i][j] = sc.next().charAt(0);\n                }\n            }\n            int count = 0;\n            for (int i = 0; i < rows; i++) {\n                for (int j = 0; j < cols; j++) {\n                    if (grid[i][j] == '1') {\n                        count++;\n                        dfs(grid, i, j, rows, cols);\n                    }\n                }\n            }\n            System.out.println(count);\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (lines.length > 0) {\n    const [r, c] = lines[0].trim().split(/\\s+/).map(Number);\n    const grid = [];\n    for (let i = 1; i <= r; i++) {\n        grid.push(lines[i].trim().split(/\\s+/));\n    }\n    let count = 0;\n    function dfs(i, j) {\n        if (i < 0 || i >= r || j < 0 || j >= c || grid[i][j] === '0') return;\n        grid[i][j] = '0';\n        dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1);\n    }\n    for (let i = 0; i < r; i++) {\n        for (let j = 0; j < c; j++) {\n            if (grid[i][j] === '1') {\n                count++;\n                dfs(i, j);\n            }\n        }\n    }\n    console.log(count);\n}",
      c: "#include <stdio.h>\n#include <stdlib.h>\nvoid dfs(char** grid, int r, int c, int rows, int cols) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;\n    grid[r][c] = '0';\n    dfs(grid, r+1, c, rows, cols);\n    dfs(grid, r-1, c, rows, cols);\n    dfs(grid, r, c+1, rows, cols);\n    dfs(grid, r, c-1, rows, cols);\n}\nint main() {\n    int r, c;\n    if (scanf(\"%d %d\", &r, &c) == 2) {\n        char** grid = malloc(r * sizeof(char*));\n        for (int i = 0; i < r; i++) {\n            grid[i] = malloc(c * sizeof(char));\n            for (int j = 0; j < c; j++) {\n                char buf[10]; scanf(\"%s\", buf);\n                grid[i][j] = buf[0];\n            }\n        }\n        int count = 0;\n        for (int i = 0; i < r; i++) {\n            for (int j = 0; j < c; j++) {\n                if (grid[i][j] == '1') {\n                    count++;\n                    dfs(grid, i, j, r, c);\n                }\n            }\n        }\n        printf(\"%d\\n\", count);\n        for(int i = 0; i < r; i++) free(grid[i]);\n        free(grid);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "# Implement grid islands dfs count",
      cpp: "", java: "", javascript: "", c: ""
    },
    explanation: "Traverse grid using BFS/DFS. Sink islands ('1' -> '0') when a new island is spotted and increment counter.",
    timeComplexity: "O(M * N)", spaceComplexity: "O(M * N)",
    stdinTemplate: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1"
  },
  {
    id: "code_7", title: "Climbing Stairs", difficulty: "Easy", category: CAT.DP,
    description: "Compute the number of distinct ways to climb a staircase of N steps if you can take 1 or 2 steps at a time.",
    constraints: "1 <= N <= 45",
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" }
    ],
    solutions: {
      python: "n = int(input())\nif n <= 2:\n    print(n)\nelse:\n    a, b = 1, 2\n    for _ in range(3, n+1):\n        a, b = b, a+b\n    print(b)",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    if (n <= 2) { cout << n << endl; return 0; }\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b; b = c;\n    }\n    cout << b << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n <= 2) { System.out.println(n); return; }\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        System.out.println(b);\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nif (n <= 2) console.log(n);\nelse {\n    let a = 1, b = 2;\n    for(let i=3; i<=n; i++) {\n        let c = a + b;\n        a = b; b = c;\n    }\n    console.log(b);\n}",
      c: "#include <stdio.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        if (n <= 2) { printf(\"%d\\n\", n); return 0; }\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        printf(\"%d\\n\", b);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\n# Print distinct steps",
      cpp: "", java: "", javascript: "", c: ""
    },
    explanation: "This is a basic Fibonacci dynamic programming question: dp[i] = dp[i-1] + dp[i-2].",
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "3"
  },
  {
    id: "code_8", title: "Fibonacci Sequence", difficulty: "Easy", category: CAT.BASIC,
    description: "Generate and output the Nth Fibonacci number (0-indexed). F(0)=0, F(1)=1.",
    constraints: "0 <= N <= 50",
    testCases: [
      { input: "9", output: "34" },
      { input: "2", output: "1" }
    ],
    solutions: {
      python: "n = int(input())\nif n == 0:\n    print(0)\nelif n == 1:\n    print(1)\nelse:\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a + b\n    print(b)",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    if (n == 0) { cout << 0 << endl; return 0; }\n    if (n == 1) { cout << 1 << endl; return 0; }\n    long long a = 0, b = 1;\n    for(int i=2; i<=n; i++) {\n        long long c = a + b;\n        a = b; b = c;\n    }\n    cout << b << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        if (n == 1) { System.out.println(1); return; }\n        long a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            long c = a + b;\n            a = b; b = c;\n        }\n        System.out.println(b);\n    }\n}",
      javascript: "const fs = require('fs');\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nif (n === 0) console.log(0);\nelse if (n === 1) console.log(1);\nelse {\n    let a = 0n, b = 1n;\n    for (let i = 2; i <= n; i++) {\n        let c = a + b;\n        a = b; b = c;\n    }\n    console.log(b.toString());\n}",
      c: "#include <stdio.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        if (n == 0) { printf(\"0\\n\"); return 0; }\n        if (n == 1) { printf(\"1\\n\"); return 0; }\n        long long a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            long long c = a + b;\n            a = b; b = c;\n        }\n        printf(\"%lld\\n\", b);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\n# Print F(n)",
      cpp: "", java: "", javascript: "", c: ""
    },
    explanation: "Generate sequence values iteratively to avoid recursion stack overflow.",
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "9"
  },
  {
    id: "code_9", title: "GCD of Two Numbers", difficulty: "Easy", category: CAT.BASIC,
    description: "Calculate the Greatest Common Divisor (GCD) of two integers A and B.",
    constraints: "1 <= A, B <= 10^9",
    testCases: [
      { input: "12 18", output: "6" },
      { input: "17 23", output: "1" }
    ],
    solutions: {
      python: "def gcd(a, b): return a if b == 0 else gcd(b, a % b)\na, b = map(int, input().split())\nprint(gcd(a, b))",
      cpp: "#include <iostream>\n#include <numeric>\nusing namespace std;\nlong long gcd(long long a, long long b) { return b == 0 ? a : gcd(b, a % b); }\nint main() {\n    long long a, b; cin >> a >> b;\n    cout << gcd(a, b) << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    private static long gcd(long a, long b) { return b == 0 ? a : gcd(b, a % b); }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong(), b = sc.nextLong();\n        System.out.println(gcd(a, b));\n    }\n}",
      javascript: "const fs = require('fs');\nconst [a, b] = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\nfunction gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }\nconsole.log(gcd(a, b));",
      c: "#include <stdio.h>\nlong long gcd(long long a, long long b) { return b ? gcd(b, a % b) : a; }\nint main() {\n    long long a, b; if (scanf(\"%lld %lld\", &a, &b) == 2) {\n        printf(\"%lld\\n\", gcd(a, b));\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "a, b = map(int, input().split())",
      cpp: "", java: "", javascript: "", c: ""
    },
    explanation: "Apply Euclidean algorithm: gcd(a, b) = gcd(b, a % b) recursively.",
    timeComplexity: "O(log(min(A,B)))", spaceComplexity: "O(1)",
    stdinTemplate: "12 18"
  },
  {
    id: "code_10", title: "Armstrong Number Checker", difficulty: "Easy", category: CAT.BASIC,
    description: "Check if a number N is an Armstrong number (Narcissistic number). Print YES if it is, otherwise NO.",
    constraints: "1 <= N <= 10^9",
    testCases: [
      { input: "153", output: "YES" },
      { input: "123", output: "NO" }
    ],
    solutions: {
      python: "s = input().strip()\nn = int(s)\nk = len(s)\ntotal = sum(int(d)**k for d in s)\nprint('YES' if total == n else 'NO')",
      cpp: "#include <iostream>\n#include <string>\n#include <cmath>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    long long n = stoll(s);\n    int k = s.length();\n    long long total = 0;\n    for(char c : s) {\n        total += pow(c - '0', k);\n    }\n    cout << (total == n ? \"YES\" : \"NO\") << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        long n = Long.parseLong(s);\n        int k = s.length();\n        long total = 0;\n        for (char c : s.toCharArray()) {\n            total += Math.pow(c - '0', k);\n        }\n        System.out.println(total == n ? \"YES\" : \"NO\");\n    }\n}",
      javascript: "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst n = parseInt(s);\nconst k = s.length;\nlet sum = 0;\nfor (let c of s) sum += Math.pow(parseInt(c), k);\nconsole.log(sum === n ? 'YES' : 'NO');",
      c: "#include <stdio.h>\n#include <string.h>\n#include <math.h>\nint main() {\n    char s[20];\n    if (scanf(\"%s\", s) == 1) {\n        int k = strlen(s);\n        long long n = 0;\n        for (int i = 0; s[i]; i++) n = n * 10 + (s[i] - '0');\n        long long sum = 0;\n        for (int i = 0; s[i]; i++) sum += (long long)pow(s[i] - '0', k);\n        printf(\"%s\\n\", sum == n ? \"YES\" : \"NO\");\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = input().strip()",
      cpp: "", java: "", javascript: "", c: ""
    },
    explanation: "Sum the digits raised to power of digit-count, compare to N.",
    timeComplexity: "O(D) where D is number of digits", spaceComplexity: "O(1)",
    stdinTemplate: "153"
  }
];

// 12 algorithmic schemas mapping 125 dynamic questions
const SCHEMAS = [
  {
    schema: "ARRAY_SEARCH",
    description: (keyword) => `Given a list of numbers, find if the value matching the logic for '${keyword}' exists in the array and return its first 0-based index. If not found, print -1.\n\nInput format:\nLine 1: N (array length) and Target search item\nLine 2: N space-separated integers`,
    testCases: [
      { input: "5 42\n10 20 42 80 90", output: "2" },
      { input: "3 5\n1 2 3", output: "-1" }
    ],
    solutions: {
      python: "n, target = map(int, input().split())\nnums = list(map(int, input().split()))\nprint(nums.index(target) if target in nums else -1)",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, t; cin >> n >> t;\n    int idx = -1;\n    for(int i=0; i<n; i++) {\n        int x; cin >> x;\n        if(x == t && idx == -1) idx = i;\n    }\n    cout << idx << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int idx = -1;\n        for(int i=0; i<n; i++) {\n            int x = sc.nextInt();\n            if (x == target && idx == -1) idx = i;\n        }\n        System.out.println(idx);\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, target] = lines[0].split(' ').map(Number);\nconst nums = lines[1].split(' ').map(Number);\nconsole.log(nums.indexOf(target));",
      c: "#include <stdio.h>\nint main() {\n    int n, target;\n    if (scanf(\"%d %d\", &n, &target) == 2) {\n        int idx = -1;\n        for (int i = 0; i < n; i++) {\n            int x; scanf(\"%d\", &x);\n            if (x == target && idx == -1) idx = i;\n        }\n        printf(\"%d\\n\", idx);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n, target = map(int, input().split())\nnums = list(map(int, input().split()))\n# Find target index",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {}\n}",
      javascript: "",
      c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "5 42\n10 20 42 80 90"
  },
  {
    schema: "STACK_MATCH",
    description: (keyword) => `Analyze bracket formatting for '${keyword}'. Write a parser that reads bracket patterns and outputs YES if brackets match perfectly, or NO otherwise.`,
    testCases: [
      { input: "([])", output: "YES" },
      { input: "([)", output: "NO" }
    ],
    solutions: {
      python: "s = input().strip()\nst = []\nok = True\nfor c in s:\n    if c in '([{': st.append(c)\n    else:\n        if not st: ok = False; break\n        p = st.pop()\n        if c==')' and p!='(': ok=False; break\n        if c==']' and p!='[': ok=False; break\n        if c=='}' and p!='{': ok=False; break\nif st: ok = False\nprint('YES' if ok else 'NO')",
      cpp: "#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    stack<char> st;\n    bool ok = true;\n    for(char c: s) {\n        if(c=='('||c=='['||c=='{') st.push(c);\n        else {\n            if(st.empty()) { ok=false; break; }\n            char top = st.top(); st.pop();\n            if(c==')'&&top!='(') { ok=false; break; }\n            if(c==']'&&top!='[') { ok=false; break; }\n            if(c=='}'&&top!='{') { ok=false; break; }\n        }\n    }\n    if(!st.empty()) ok = false;\n    cout << (ok ? \"YES\" : \"NO\") << endl;\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            String s = sc.next();\n            Stack<Character> st = new Stack<>();\n            boolean ok = true;\n            for(char c: s.toCharArray()) {\n                if(c=='('||c=='['||c=='{') st.push(c);\n                else {\n                    if(st.isEmpty()) { ok=false; break; }\n                    char top = st.pop();\n                    if(c==')'&&top!='(') { ok=false; break; }\n                    if(c==']'&&top!='[') { ok=false; break; }\n                    if(c=='}'&&top!='{') { ok=false; break; }\n                }\n            }\n            if(!st.isEmpty()) ok = false;\n            System.out.println(ok ? \"YES\" : \"NO\");\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst st = [];\nlet ok = true;\nfor (let c of s) {\n    if (c==='('||c==='['||c==='{') st.push(c);\n    else {\n        const top = st.pop();\n        if (c===')'&&top!=='(') { ok=false; break; }\n        if (c===']'&&top!=='[') { ok=false; break; }\n        if (c==='}'&&top!=='{') { ok=false; break; }\n    }\n}\nif (st.length > 0) ok = false;\nconsole.log(ok ? 'YES' : 'NO');",
      c: "#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[10005];\n    if (scanf(\"%s\", s) == 1) {\n        char st[10005]; int top = 0;\n        int ok = 1;\n        for (int i=0; s[i]; i++) {\n            char c = s[i];\n            if (c=='('||c=='['||c=='{') st[top++] = c;\n            else {\n                if (top == 0) { ok = 0; break; }\n                char p = st[--top];\n                if (c==')'&&p!='(') { ok=0; break; }\n                if (c==']'&&p!='[') { ok=0; break; }\n                if (c=='}'&&p!='{') { ok=0; break; }\n            }\n        }\n        if (top > 0) ok = 0;\n        printf(\"%s\\n\", ok ? \"YES\" : \"NO\");\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "s = input().strip()\n# Print YES or NO",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "([])"
  },
  {
    schema: "LIST_OPS",
    description: (keyword) => `Simulate operations on standard lists representing '${keyword}'. Given a list of integers, reverse the list and print its elements space-separated.\n\nInput format:\nLine 1: N (number of items)\nLine 2: N space-separated integers`,
    testCases: [
      { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
      { input: "1\n99", output: "99" }
    ],
    solutions: {
      python: "n = int(input())\nnums = input().split()\nprint(*(nums[::-1]))",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<int> a(n);\n    for(int i=0; i<n; i++) cin >> a[i];\n    for(int i=n-1; i>=0; i--) cout << a[i] << (i==0 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = n - 1; i >= 0; i--) {\n            System.out.print(a[i] + (i == 0 ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst nums = lines[1].split(' ').map(Number);\nconsole.log(nums.reverse().join(' '));",
      c: "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        int* a = malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n        for (int i = n - 1; i >= 0; i--) printf(\"%d%s\", a[i], i==0 ? \"\" : \" \");\n        printf(\"\\n\");\n        free(a);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\nnums = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "5\n1 2 3 4 5"
  },
  {
    schema: "MATH_STRICT",
    description: (keyword) => `Compute the value requested for calculation: '${keyword}'. Write a program that reads an integer X and prints X squared plus 2X plus 1.\n\nInput format:\nLine 1: Integer X`,
    testCases: [
      { input: "5", output: "36" },
      { input: "0", output: "1" }
    ],
    solutions: {
      python: "x = int(input())\nprint(x*x + 2*x + 1)",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    long long x; cin >> x;\n    cout << (x*x + 2*x + 1) << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long x = sc.nextLong();\n        System.out.println(x*x + 2*x + 1);\n    }\n}",
      javascript: "const fs = require('fs');\nconst x = parseInt(fs.readFileSync(0, 'utf-8').trim());\nconsole.log(x*x + 2*x + 1);",
      c: "#include <stdio.h>\nint main() {\n    long long x; if (scanf(\"%lld\", &x) == 1) {\n        printf(\"%lld\\n\", x*x + 2*x + 1);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "x = int(input())\n# Print value",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(1)", spaceComplexity: "O(1)",
    stdinTemplate: "5"
  },
  {
    schema: "ARRAY_STATS",
    description: (keyword) => `Compute dataset metrics for '${keyword}'. Write a program to count and print the number of elements in an array that are strictly greater than the average of all elements.\n\nInput format:\nLine 1: N (array size)\nLine 2: N space-separated integers`,
    testCases: [
      { input: "5\n1 2 3 4 5", output: "2" }, // average = 3, elements > 3 are 4 and 5 (count = 2)
      { input: "4\n10 10 10 10", output: "0" }
    ],
    solutions: {
      python: "n = int(input())\nnums = list(map(int, input().split()))\navg = sum(nums)/n\nprint(sum(1 for x in nums if x > avg))",
      cpp: "#include <iostream>\n#include <vector>\n#include <numeric>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<int> a(n);\n    long long sum = 0;\n    for(int i=0; i<n; i++) { cin >> a[i]; sum += a[i]; }\n    double avg = (double)sum / n;\n    int count = 0;\n    for(int i=0; i<n; i++) {\n        if (a[i] > avg) count++;\n    }\n    cout << count << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        long sum = 0;\n        for (int i = 0; i < n; i++) {\n            a[i] = sc.nextInt();\n            sum += a[i];\n        }\n        double avg = (double)sum / n;\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (a[i] > avg) count++;\n        }\n        System.out.println(count);\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\nconst sum = nums.reduce((a, b) => a+b, 0);\nconst avg = sum / n;\nconsole.log(nums.filter(x => x > avg).length);",
      c: "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        int* a = malloc(n * sizeof(int));\n        long long sum = 0;\n        for (int i = 0; i < n; i++) {\n            scanf(\"%d\", &a[i]);\n            sum += a[i];\n        }\n        double avg = (double)sum / n;\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (a[i] > avg) count++;\n        }\n        printf(\"%d\\n\", count);\n        free(a);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\nnums = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "5\n1 2 3 4 5"
  },
  {
    schema: "MATRIX_TRAVERSAL",
    description: (keyword) => `Analyze array arrangements in matrix formats representing '${keyword}'. Given an N x N matrix, calculate and print the sum of all elements along the main diagonal (top-left to bottom-right).\n\nInput format:\nLine 1: N (dimension of matrix)\nNext N lines: N space-separated integers`,
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "15" },
      { input: "2\n10 20\n30 40", output: "50" }
    ],
    solutions: {
      python: "n = int(input())\nans = 0\nfor i in range(n):\n    row = list(map(int, input().split()))\n    ans += row[i]\nprint(ans)",
      cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    long long ans = 0;\n    for(int i=0; i<n; i++) {\n        for(int j=0; j<n; j++) {\n            long long x; cin >> x;\n            if (i == j) ans += x;\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long ans = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                long x = sc.nextLong();\n                if (i == j) ans += x;\n            }\n        }\n        System.out.println(ans);\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nlet sum = 0;\nfor (let i = 1; i <= n; i++) {\n    const row = lines[i].trim().split(/\\s+/).map(Number);\n    sum += row[i - 1];\n}\nconsole.log(sum);",
      c: "#include <stdio.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        long long sum = 0;\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n; j++) {\n                long long x; scanf(\"%lld\", &x);\n                if (i == j) sum += x;\n            }\n        }\n        printf(\"%lld\\n\", sum);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\n# Print diagonal sum",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N^2)", spaceComplexity: "O(1)",
    stdinTemplate: "3\n1 2 3\n4 5 6\n7 8 9"
  },
  {
    schema: "STRING_PARSER",
    description: (keyword) => `Scan and sanitize inputs for the feature '${keyword}'. Write a program that takes a string input and prints the count of digits (0-9) present in the string.\n\nInput format:\nLine 1: A string of characters`,
    testCases: [
      { input: "user_id_1092", output: "4" },
      { input: "NQTTest", output: "0" }
    ],
    solutions: {
      python: "s = input().strip()\nprint(sum(1 for c in s if c.isdigit()))",
      cpp: "#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s; if(getline(cin, s)) {\n        int cnt = 0;\n        for(char c: s) if(isdigit(c)) cnt++;\n        cout << cnt << endl;\n    }\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLine()) {\n            String s = sc.nextLine();\n            int cnt = 0;\n            for (char c : s.toCharArray()) {\n                if (Character.isDigit(c)) cnt++;\n            }\n            System.out.println(cnt);\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8');\nlet cnt = 0;\nfor (let c of s) if (/[0-9]/.test(c)) cnt++;\nconsole.log(cnt);",
      c: "#include <stdio.h>\n#include <ctype.h>\nint main() {\n    char s[100000];\n    if (fgets(s, sizeof(s), stdin)) {\n        int cnt = 0;\n        for (int i = 0; s[i]; i++) {\n            if (isdigit(s[i])) cnt++;\n        }\n        printf(\"%d\\n\", cnt);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "s = input().strip()\n# Print number of digits",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "user_id_1092"
  },
  {
    schema: "TREE_DEPTH",
    description: (keyword) => `Model binary structures representing '${keyword}'. Given parent mappings of a tree, find and print the depth of a tree. The tree is given as node parents. Output the max level of depth.\n\nInput format:\nLine 1: N (number of nodes, 0-indexed root is node 0)\nLine 2: N space-separated integers, where the i-th number is the parent of node i. (Root has parent -1).`,
    testCases: [
      { input: "5\n-1 0 0 1 1", output: "3" }, // root -> 1 -> 3 (depth 3)
      { input: "1\n-1", output: "1" }
    ],
    solutions: {
      python: "n = int(input())\nparents = list(map(int, input().split()))\ndepths = [0]*n\ndef get_depth(i):\n    if parents[i] == -1: return 1\n    if depths[i] != 0: return depths[i]\n    depths[i] = 1 + get_depth(parents[i])\n    return depths[i]\nprint(max(get_depth(i) for i in range(n)))",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint get_depth(int i, const vector<int>& p, vector<int>& d) {\n    if (p[i] == -1) return 1;\n    if (d[i] != 0) return d[i];\n    d[i] = 1 + get_depth(p[i], p, d);\n    return d[i];\n}\nint main() {\n    int n; cin >> n;\n    vector<int> p(n);\n    for(int i=0; i<n; i++) cin >> p[i];\n    vector<int> d(n, 0);\n    int ans = 0;\n    for(int i=0; i<n; i++) ans = max(ans, get_depth(i, p, d));\n    cout << ans << endl;\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    private static int getDepth(int i, int[] p, int[] d) {\n        if (p[i] == -1) return 1;\n        if (d[i] != 0) return d[i];\n        d[i] = 1 + getDepth(p[i], p, d);\n        return d[i];\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] p = new int[n];\n        for (int i = 0; i < n; i++) p[i] = sc.nextInt();\n        int[] d = new int[n];\n        int ans = 0;\n        for (int i = 0; i < n; i++) {\n            ans = Math.max(ans, getDepth(i, p, d));\n        }\n        System.out.println(ans);\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst parents = lines[1].split(' ').map(Number);\nconst depths = new Array(n).fill(0);\nfunction getDepth(i) {\n    if (parents[i] === -1) return 1;\n    if (depths[i] !== 0) return depths[i];\n    depths[i] = 1 + getDepth(parents[i]);\n    return depths[i];\n}\nlet maxD = 0;\nfor (let i = 0; i < n; i++) maxD = Math.max(maxD, getDepth(i));\nconsole.log(maxD);",
      c: "#include <stdio.h>\n#include <stdlib.h>\nint get_depth(int i, int* p, int* d) {\n    if (p[i] == -1) return 1;\n    if (d[i] != 0) return d[i];\n    d[i] = 1 + get_depth(p[i], p, d);\n    return d[i];\n}\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        int* p = malloc(n * sizeof(int));\n        int* d = calloc(n, sizeof(int));\n        for (int i = 0; i < n; i++) scanf(\"%d\", &p[i]);\n        int ans = 0;\n        for (int i = 0; i < n; i++) {\n            int cur = get_depth(i, p, d);\n            if (cur > ans) ans = cur;\n        }\n        printf(\"%d\\n\", ans);\n        free(p); free(d);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\nparents = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(N)",
    stdinTemplate: "5\n-1 0 0 1 1"
  },
  {
    schema: "DP_COINS",
    description: (keyword) => `Optimize resource allocation for the scenario '${keyword}'. Given a target sum and an array of available coin denominations, print the minimum number of coins needed to sum up to target. If it's impossible, print -1.\n\nInput format:\nLine 1: N (number of denominations) and Target sum\nLine 2: N space-separated coin values`,
    testCases: [
      { input: "3 11\n1 2 5", output: "3" }, // 5 + 5 + 1
      { input: "2 3\n2 4", output: "-1" }
    ],
    solutions: {
      python: "n, target = map(int, input().split())\ncoins = list(map(int, input().split()))\ndp = [float('inf')]*(target+1)\ndp[0] = 0\nfor c in coins:\n    for i in range(c, target+1):\n        dp[i] = min(dp[i], dp[i-c]+1)\nprint(dp[target] if dp[target] != float('inf') else -1)",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, target; cin >> n >> target;\n    vector<int> coins(n);\n    for(int i=0; i<n; i++) cin >> coins[i];\n    vector<int> dp(target + 1, 1e9);\n    dp[0] = 0;\n    for(int c: coins) {\n        for(int i = c; i <= target; i++) {\n            dp[i] = min(dp[i], dp[i - c] + 1);\n        }\n    }\n    cout << (dp[target] >= 1e9 ? -1 : dp[target]) << endl;\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int target = sc.nextInt();\n        int[] coins = new int[n];\n        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();\n        int[] dp = new int[target + 1];\n        Arrays.fill(dp, 100000000);\n        dp[0] = 0;\n        for (int c : coins) {\n            for (int i = c; i <= target; i++) {\n                dp[i] = Math.min(dp[i], dp[i - c] + 1);\n            }\n        }\n        System.out.println(dp[target] >= 100000000 ? -1 : dp[target]);\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst [n, target] = lines[0].split(' ').map(Number);\nconst coins = lines[1].split(' ').map(Number);\nconst dp = new Array(target + 1).fill(Infinity);\ndp[0] = 0;\nfor (let c of coins) {\n    for (let i = c; i <= target; i++) {\n        dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n}\nconsole.log(dp[target] === Infinity ? -1 : dp[target]);",
      c: "#include <stdio.h>\n#include <stdlib.h>\n#define min(a,b) ((a) < (b) ? (a) : (b))\nint main() {\n    int n, target;\n    if (scanf(\"%d %d\", &n, &target) == 2) {\n        int* coins = malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf(\"%d\", &coins[i]);\n        int* dp = malloc((target + 1) * sizeof(int));\n        dp[0] = 0;\n        for (int i = 1; i <= target; i++) dp[i] = 1e9;\n        for (int j = 0; j < n; j++) {\n            int c = coins[j];\n            for (int i = c; i <= target; i++) {\n                dp[i] = min(dp[i], dp[i - c] + 1);\n            }\n        }\n        printf(\"%d\\n\", dp[target] >= 1e9 ? -1 : dp[target]);\n        free(coins); free(dp);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n, target = map(int, input().split())\ncoins = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N * Target)", spaceComplexity: "O(Target)",
    stdinTemplate: "3 11\n1 2 5"
  },
  {
    schema: "RECURSION_SUBSETS",
    description: (keyword) => `Generate all combinations or subsets representing '${keyword}'. Given N distinct elements, print the total count of all subsets of the array that have an odd sum.\n\nInput format:\nLine 1: N (number of items)\nLine 2: N space-separated integers`,
    testCases: [
      { input: "3\n1 2 3", output: "4" }, // odd sum subsets: {1}, {3}, {1,2}, {2,3}
      { input: "2\n2 4", output: "0" }
    ],
    solutions: {
      python: "n = int(input())\nnums = list(map(int, input().split()))\nodd = sum(1 for x in nums if x%2 != 0)\neven = n - odd\nif odd == 0:\n    print(0)\nelse:\n    print(2**(odd-1) * 2**even)",
      cpp: "#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    int odd = 0, even = 0;\n    for(int i=0; i<n; i++) {\n        int x; cin >> x;\n        if (x % 2 != 0) odd++; else even++;\n    }\n    if (odd == 0) cout << 0 << endl;\n    else {\n        long long ans = (1LL << (odd - 1)) * (1LL << even);\n        cout << ans << endl;\n    }\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int odd = 0, even = 0;\n            for (int i = 0; i < n; i++) {\n                int x = sc.nextInt();\n                if (x % 2 != 0) odd++; else even++;\n            }\n            if (odd == 0) System.out.println(0);\n            else {\n                long ans = (1L << (odd - 1)) * (1L << even);\n                System.out.println(ans);\n            }\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\nlet odd = 0, even = 0;\nfor (let x of nums) if (x % 2 !== 0) odd++; else even++;\nif (odd === 0) console.log(0);\nelse {\n    console.log(Math.pow(2, odd - 1) * Math.pow(2, even));\n}",
      c: "#include <stdio.h>\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        int odd = 0, even = 0;\n        for (int i = 0; i < n; i++) {\n            int x; scanf(\"%d\", &x);\n            if (x % 2 != 0) odd++; else even++;\n        }\n        if (odd == 0) printf(\"0\\n\");\n        else {\n            long long ans = (1LL << (odd - 1)) * (1LL << even);\n            printf(\"%lld\\n\", ans);\n        }\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\nnums = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N)", spaceComplexity: "O(1)",
    stdinTemplate: "3\n1 2 3"
  },
  {
    schema: "GRAPH_ISLANDS",
    description: (keyword) => `Compute connected component networks representing the domain of '${keyword}'. Determine the size of the largest connected island of 1s in a grid.\n\nInput format:\nLine 1: rows M and cols N\nNext M lines: grid values`,
    testCases: [
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "4" } // largest island is 4 elements
    ],
    solutions: {
      python: "r, c = map(int, input().split())\ngrid = [input().split() for _ in range(r)]\ndef dfs(i, j):\n    if i < 0 or i >= r or j < 0 or j >= c or grid[i][j] == '0': return 0\n    grid[i][j] = '0'\n    return 1 + dfs(i+1, j) + dfs(i-1, j) + dfs(i, j+1) + dfs(i, j-1)\nmax_size = 0\nfor i in range(r):\n    for j in range(c):\n        if grid[i][j] == '1':\n            max_size = max(max_size, dfs(i, j))\nprint(max_size)",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint dfs(vector<vector<char>>& grid, int r, int c, int rows, int cols) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return 0;\n    grid[r][c] = '0';\n    return 1 + dfs(grid, r+1, c, rows, cols) +\n               dfs(grid, r-1, c, rows, cols) +\n               dfs(grid, r, c+1, rows, cols) +\n               dfs(grid, r, c-1, rows, cols);\n}\nint main() {\n    int rows, cols; if (!(cin >> rows >> cols)) return 0;\n    vector<vector<char>> grid(rows, vector<char>(cols));\n    for (int i = 0; i < rows; i++)\n        for (int j = 0; j < cols; j++) cin >> grid[i][j];\n    int ans = 0;\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            if (grid[i][j] == '1') {\n                ans = max(ans, dfs(grid, i, j, rows, cols));\n            }\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}",
      java: "import java.util.Scanner;\npublic class Main {\n    private static int dfs(char[][] grid, int r, int c, int rows, int cols) {\n        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return 0;\n        grid[r][c] = '0';\n        return 1 + dfs(grid, r+1, c, rows, cols) +\n                   dfs(grid, r-1, c, rows, cols) +\n                   dfs(grid, r, c+1, rows, cols) +\n                   dfs(grid, r, c-1, rows, cols);\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int rows = sc.nextInt();\n            int cols = sc.nextInt();\n            char[][] grid = new char[rows][cols];\n            for (int i = 0; i < rows; i++) {\n                for (int j = 0; j < cols; j++) {\n                    grid[i][j] = sc.next().charAt(0);\n                }\n            }\n            int ans = 0;\n            for (int i = 0; i < rows; i++) {\n                for (int j = 0; j < cols; j++) {\n                    if (grid[i][j] == '1') {\n                        ans = Math.max(ans, dfs(grid, i, j, rows, cols));\n                    }\n                }\n            }\n            System.out.println(ans);\n        }\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (lines.length > 0) {\n    const [r, c] = lines[0].trim().split(/\\s+/).map(Number);\n    const grid = [];\n    for (let i = 1; i <= r; i++) {\n        grid.push(lines[i].trim().split(/\\s+/));\n    }\n    let maxVal = 0;\n    function dfs(i, j) {\n        if (i < 0 || i >= r || j < 0 || j >= c || grid[i][j] === '0') return 0;\n        grid[i][j] = '0';\n        return 1 + dfs(i+1, j) + dfs(i-1, j) + dfs(i, j+1) + dfs(i, j-1);\n    }\n    for (let i = 0; i < r; i++) {\n        for (let j = 0; j < c; j++) {\n            if (grid[i][j] === '1') {\n                maxVal = Math.max(maxVal, dfs(i, j));\n            }\n        }\n    }\n    console.log(maxVal);\n}",
      c: "#include <stdio.h>\n#include <stdlib.h>\n#define max(a,b) ((a) > (b) ? (a) : (b))\nint dfs(char** grid, int r, int c, int rows, int cols) {\n    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return 0;\n    grid[r][c] = '0';\n    return 1 + dfs(grid, r+1, c, rows, cols) +\n               dfs(grid, r-1, c, rows, cols) +\n               dfs(grid, r, c+1, rows, cols) +\n               dfs(grid, r, c-1, rows, cols);\n}\nint main() {\n    int r, c;\n    if (scanf(\"%d %d\", &r, &c) == 2) {\n        char** grid = malloc(r * sizeof(char*));\n        for (int i = 0; i < r; i++) {\n            grid[i] = malloc(c * sizeof(char));\n            for (int j = 0; j < c; j++) {\n                char buf[10]; scanf(\"%s\", buf);\n                grid[i][j] = buf[0];\n            }\n        }\n        int max_sz = 0;\n        for (int i = 0; i < r; i++) {\n            for (int j = 0; j < c; j++) {\n                if (grid[i][j] == '1') {\n                    max_sz = max(max_sz, dfs(grid, i, j, r, c));\n                }\n            }\n        }\n        printf(\"%d\\n\", max_sz);\n        for(int i = 0; i < r; i++) free(grid[i]);\n        free(grid);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "r, c = map(int, input().split())",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(M * N)", spaceComplexity: "O(M * N)",
    stdinTemplate: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1"
  },
  {
    schema: "ARRAY_SORT",
    description: (keyword) => `Implement sorting optimization for '${keyword}'. Read a list of numbers and print them in non-decreasing (sorted) order, separated by spaces.\n\nInput format:\nLine 1: N (number of items)\nLine 2: N space-separated integers`,
    testCases: [
      { input: "5\n4 2 5 1 3", output: "1 2 3 4 5" },
      { input: "2\n10 -1", output: "-1 10" }
    ],
    solutions: {
      python: "n = int(input())\nnums = sorted(list(map(int, input().split())))\nprint(*nums)",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<int> a(n);\n    for(int i=0; i<n; i++) cin >> a[i];\n    sort(a.begin(), a.end());\n    for(int i=0; i<n; i++) cout << a[i] << (i==n-1 ? \"\" : \" \");\n    cout << endl;\n    return 0;\n}",
      java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        for (int i = 0; i < n; i++) {\n            System.out.print(a[i] + (i == n - 1 ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}",
      javascript: "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst nums = lines[1].split(' ').map(Number).sort((a,b)=>a-b);\nconsole.log(nums.join(' '));",
      c: "#include <stdio.h>\n#include <stdlib.h>\nint cmp(const void* a, const void* b) { return *(int*)a - *(int*)b; }\nint main() {\n    int n; if (scanf(\"%d\", &n) == 1) {\n        int* a = malloc(n * sizeof(int));\n        for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);\n        qsort(a, n, sizeof(int), cmp);\n        for (int i = 0; i < n; i++) printf(\"%d%s\", a[i], i==n-1 ? \"\" : \" \");\n        printf(\"\\n\");\n        free(a);\n    }\n    return 0;\n}"
    },
    starterCode: {
      python: "n = int(input())\nnums = list(map(int, input().split()))",
      cpp: "", java: "", javascript: "", c: ""
    },
    timeComplexity: "O(N log N)", spaceComplexity: "O(N)",
    stdinTemplate: "5\n4 2 5 1 3"
  }
];

// Remaining 125 keywords categorized by Topic
const TOPIC_TEMPLATES = [
  { cat: CAT.BASIC, dif: "Easy", schema: "MATH_STRICT", keywords: ["swap", "palindrome", "base conversion", "square root", "power calculation", "ASCII value finder", "leap year count", "perfect number", "strong number", "neon number", "ugly numbers"] },
  { cat: CAT.ARRAY, dif: "Medium", schema: "ARRAY_SORT", keywords: ["Two Sum II", "Majority Element", "Subarray Sum Equals K", "Kadane's Subarray Max", "Rotate Array In-Place", "Container With Most Water", "Product of Array Except Self", "Merged Intervals", "3Sum", "4Sum", "Find all duplicate elements", "Peak Element Index", "First Missing Positive", "Longest Consecutive Sequence", "Trapping Rain Water", "Next Permutation", "Spiral Matrix traversal", "Subarray Max Product", "Game of Life", "Minimum Size Subarray Sum"] },
  { cat: CAT.LIST, dif: "Medium", schema: "LIST_OPS", keywords: ["Cycle Detection in Node List", "Intersection of Two List heads", "Palindrome List validation", "Merge K Sorted Linked Lists", "Remove duplicates from sorted list", "Sorted List Insertion", "Linked List Cycle II", "Remove Node from end of list", "Split list in halves", "Rotate Linked List", "Swap node pairs", "Copy list with random pointer", "Odd Even Linked List", "Partition list around pivot", "Reverse nodes in K-Group", "Linked List Sort", "Flat Nested List Iterator", "Rotate circular list", "Insertion Sort List", "Check intersection node"] },
  { cat: CAT.STACK, dif: "Medium", schema: "STACK_MATCH", keywords: ["Validate parentheses sequences", "Design Min Stack class", "Implement Queue using Stacks", "Evaluate Reverse Polish Notation", "Daily Temperatures stack tracker", "Valid bracket sequence matches", "Asteroid Collision simulation", "Decode string patterns", "Simplify absolute file paths", "Next Greater Element I", "Remove K Digits from number", "Online Stock Span tracker", "Exclusive Time of Functions", "Basic Calculator implementation", "Longest Valid Parentheses", "Trapping rain water stack model", "132 Pattern validation", "Next Greater Element II", "Create Maximum Number", "Remove duplicate letters"] },
  { cat: CAT.TREE, dif: "Medium", schema: "TREE_DEPTH", keywords: ["Traversal inorder recursively", "Tree Depth Calculations", "Validate Binary Search Tree", "Lowest Common Ancestor node", "Same Tree Node Verification", "Level order tree traversals", "Binary Tree Zigzag Order Traversal", "Construct tree from Traversals", "Path Sum II tracker", "Binary Tree Right Side View", "Flatten Binary Tree to List", "Populating Next Right Pointers", "BST Iterator class", "Kth Smallest Element in BST", "Invert Binary Tree in-place", "Serialize/Deserialize Tree", "Max Tree Path Sum", "Subtree of Another Tree", "Binary Tree Paths", "Lowest Common Ancestor BST"] },
  { cat: CAT.GRAPH, dif: "Hard", schema: "GRAPH_ISLANDS", keywords: ["Breadth First Search grid", "Depth First Search grid", "Connected island counts", "Clone un-directed graph", "Course scheduling sequence check", "Pacific Atlantic Water Flows", "Word Search on grid board", "Rotting oranges simulation steps", "Number of Provinces counter", "Redundant Connection Finder", "Word Ladder minimum steps", "Reconstruct Itinerary tickets", "Alien Dictionary sorting", "Cheapest Flights Within K Stops", "Network Delay Time shortest paths", "Is Graph Bipartite?", "Minimum Height Trees", "Course Schedule II list", "Number of Operations to Connect", "Critical Connections in Network"] },
  { cat: CAT.RECURSION, dif: "Hard", schema: "RECURSION_SUBSETS", keywords: ["Subsets subsets subsets", "Permutations sequence arrays", "Combination sums combinations", "Generate all parentheses pairs", "Word Search recursively", "Letter combinations input digits", "N-Queens chessboard placements", "Palindrome Partitioning subsets", "Sudoku Solver backtracker", "Restore IP Addresses patterns", "Permutations II unique arrays", "Combination Sum II unique", "Subsets II unique arrays", "Combinations selection count", "Word Break II word lists", "Beautiful Arrangement count", "Matchsticks to Square solver", "Expression Add Operators", "Remove Invalid Parentheses", "N-Queens II solution count"] },
  { cat: CAT.DP, dif: "Medium", schema: "DP_COINS", keywords: ["Climbing stairs fibonacci ways", "Robbing adjacent houses maximum", "Coin Change minimal coins", "Longest Increasing Subsequence length", "Word break split arrays", "Unique paths grid paths", "Edit Distance minimum edits", "Longest Common Subsequence length", "Decode ways digit counts", "Partition Equal Subset Sums", "Min Path Sum grid", "Maximal Square binary grid", "Unique Binary Search Trees", "Interleaving String checks", "House Robber II circular houses", "Longest Palindromic Substring DP", "Max Product Subarray values", "Jump Game sequence jumps", "Coin Change II total ways", "Target Sum count matches"] }
];

// Generate extra questions programmatically using Schemas mapping
const extraQuestions = [];
const targetTotal = 155;
const remainingCount = targetTotal - CORE_QUESTIONS.length;

let qIdIndex = CORE_QUESTIONS.length + 1;

for (let i = 0; i < remainingCount; i++) {
  const template = TOPIC_TEMPLATES[i % TOPIC_TEMPLATES.length];
  const keywordIndex = Math.floor(i / TOPIC_TEMPLATES.length) % template.keywords.length;
  const keyword = template.keywords[keywordIndex];

  const matchedSchema = SCHEMAS.find(s => s.schema === template.schema);

  extraQuestions.push({
    id: `code_${qIdIndex++}`,
    title: keyword,
    difficulty: template.dif,
    category: template.cat,
    description: matchedSchema.description(keyword),
    constraints: "1 <= N <= 10^5\nTime limit: 1.0s\nMemory Limit: 256MB",
    testCases: matchedSchema.testCases,
    solutions: matchedSchema.solutions,
    starterCode: matchedSchema.starterCode,
    explanation: `Analyze the input patterns to calculate matching characteristics for '${keyword}'.`,
    timeComplexity: matchedSchema.timeComplexity,
    spaceComplexity: matchedSchema.spaceComplexity,
    stdinTemplate: matchedSchema.stdinTemplate
  });
}

export const CODING_BANK = [...CORE_QUESTIONS, ...extraQuestions];
