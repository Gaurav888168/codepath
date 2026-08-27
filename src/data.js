import scrapedDsaData from '../scraped_data/kodin_dsa_data.json';

const topicIcons = ['⏱️', '🧭', '📚', '🚦', '🏗️', '🔗', '🌳', '🔁', '🧩', '📦', '🎯', '✂️', '🕸️', '🌲', '🔃', '🔎', '🔤', '🪟'];

const coreTopicsData = [
  {
    id: 'loops',
    title: 'Loops & Conditions',
    desc: 'Controlling execution flow using for/while loops and if/else conditions.',
    difficulty: 'Easy',
    analogy: 'Imagine a factory assembly line. A scanner checks each box (condition). If it has a green label, keep it. If it has a red label, discard it. Repeating this for all boxes on the belt is a loop!',
    lessons: [
      {
        title: 'What is a Loop?',
        content: 'A loop allows you to repeat a block of code multiple times. Instead of writing the same line 10 times, you tell the computer: "Do this 10 times, counting from 1 to 10."'
      },
      {
        title: 'Adding Conditions',
        content: 'Conditions (if/else) let your loop make decisions on each iteration. For example, "For each number from 1 to 10, print it ONLY if it is even."'
      }
    ],
    dryRun: {
      code: [
        'let count = 0;',
        'for (let i = 1; i <= 3; i++) {',
        '  if (i % 2 !== 0) {',
        '    count += i;',
        '  }',
        '}'
      ],
      steps: [
        { line: 0, vars: { count: 0 }, desc: 'Initialize count to 0.' },
        { line: 1, vars: { count: 0, i: 1 }, desc: 'Start loop. i is initialized to 1. Check if 1 <= 3 (True).' },
        { line: 2, vars: { count: 0, i: 1 }, desc: 'Check if i (1) is odd. 1 % 2 !== 0 is True.' },
        { line: 3, vars: { count: 1, i: 1 }, desc: 'Odd number! Add i (1) to count. count becomes 1.' },
        { line: 1, vars: { count: 1, i: 2 }, desc: 'Increment i to 2. Check if 2 <= 3 (True).' },
        { line: 2, vars: { count: 1, i: 2 }, desc: 'Check if i (2) is odd. 2 % 2 !== 0 is False.' },
        { line: 1, vars: { count: 1, i: 3 }, desc: 'Increment i to 3. Check if 3 <= 3 (True).' },
        { line: 2, vars: { count: 1, i: 3 }, desc: 'Check if i (3) is odd. 3 % 2 !== 0 is True.' },
        { line: 3, vars: { count: 4, i: 3 }, desc: 'Odd number! Add i (3) to count. count becomes 4.' },
        { line: 1, vars: { count: 4, i: 4 }, desc: 'Increment i to 4. Check if 4 <= 3 (False). Loop ends.' }
      ]
    }
  },
  {
    id: 'functions',
    title: 'Functions & Scope',
    desc: 'Packaging reusable code blocks, passing parameters, and understanding variable scope.',
    difficulty: 'Medium',
    analogy: 'Think of a recipe card in a kitchen. The function is the recipe. The ingredients you pass in are the "parameters." The cooked meal is the "return value." The recipe lives in its own scope—variables created inside the kitchen cannot be accessed from outside!',
    lessons: [
      {
        title: 'Reusable Recipes',
        content: 'Functions allow you to declare a set of actions once, and call them anywhere with different inputs. This keeps code DRY (Don\'t Repeat Yourself).'
      },
      {
        title: 'Local vs Global Scope',
        content: 'Variables declared inside a function are local to that function. They are created when the function starts and destroyed when it returns.'
      }
    ],
    dryRun: {
      code: [
        'function addBonus(score) {',
        '  let bonus = 50;',
        '  return score + bonus;',
        '}',
        'let finalScore = addBonus(100);'
      ],
      steps: [
        { line: 4, vars: {}, desc: 'Call addBonus with parameter score = 100.' },
        { line: 0, vars: { score: 100 }, desc: 'Enter function addBonus. score is 100.' },
        { line: 1, vars: { score: 100, bonus: 50 }, desc: 'Declare local variable bonus and set it to 50.' },
        { line: 2, vars: { score: 100, bonus: 50 }, desc: 'Calculate return value: score (100) + bonus (50) = 150.' },
        { line: 4, vars: { finalScore: 150 }, desc: 'Function exits. finalScore is assigned the returned value 150. local variable bonus is destroyed.' }
      ]
    }
  },
  {
    id: 'recursion',
    title: 'Recursion & Call Stacks',
    desc: 'Functions that call themselves, base cases, and how the stack memory operates.',
    difficulty: 'Hard',
    analogy: 'Imagine a Matryoshka Russian doll. To reach the gold key inside the smallest doll, you open a doll (recursive call), revealing another smaller doll. You repeat this until you find the key (base case). Then, you put the dolls back together one by one (winding back up the call stack).',
    lessons: [
      {
        title: 'What is Recursion?',
        content: 'Recursion is a technique where a function calls itself. To prevent infinite loops, every recursive function MUST have a base case—a condition under which it returns a value directly instead of calling itself again.'
      },
      {
        title: 'The Call Stack',
        content: 'Every time a function is called, the computer pushes a frame containing its local variables onto the call stack. When a function returns, its frame is popped. In recursion, the stack grows deeper with each self-call!'
      }
    ],
    dryRun: {
      code: [
        'function factorial(n) {',
        '  if (n <= 1) return 1;',
        '  return n * factorial(n - 1);',
        '}',
        'let result = factorial(3);'
      ],
      steps: [
        { line: 4, vars: {}, stack: [], desc: 'Call factorial(3).' },
        { line: 0, vars: { n: 3 }, stack: ['factorial(3)'], desc: 'Enter factorial(3). n is 3.' },
        { line: 1, vars: { n: 3 }, stack: ['factorial(3)'], desc: 'Check if n <= 1 (3 <= 1 is False). Proceed.' },
        { line: 2, vars: { n: 3 }, stack: ['factorial(3)'], desc: 'Need to compute 3 * factorial(2). Pushing new call to stack.' },
        { line: 0, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], desc: 'Enter factorial(2). n is 2.' },
        { line: 1, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], desc: 'Check if n <= 1 (2 <= 1 is False). Proceed.' },
        { line: 2, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], desc: 'Need to compute 2 * factorial(1). Pushing new call to stack.' },
        { line: 0, vars: { n: 1 }, stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'], desc: 'Enter factorial(1). n is 1.' },
        { line: 1, vars: { n: 1 }, stack: ['factorial(3)', 'factorial(2)', 'factorial(1)'], desc: 'Check if n <= 1 (1 <= 1 is True). Hit base case! Returns 1.' },
        { line: 2, vars: { n: 2 }, stack: ['factorial(3)', 'factorial(2)'], desc: 'factorial(1) returned 1. Now compute 2 * 1 = 2. factorial(2) returns 2.' },
        { line: 2, vars: { n: 3 }, stack: ['factorial(3)'], desc: 'factorial(2) returned 2. Now compute 3 * 2 = 6. factorial(3) returns 6.' },
        { line: 4, vars: { result: 6 }, stack: [], desc: 'Final execution result is 6. Call stack is empty.' }
      ]
    }
  },
  {
    id: 'stack',
    title: 'Linear Stacks',
    desc: 'LIFO (Last In First Out) structure, push, pop, and peek operations.',
    difficulty: 'Medium',
    analogy: 'Imagine a stack of dinner plates in a cafeteria. You can only add a new plate to the top (push). You can only remove the plate from the top (pop). If you want to see the color of the top plate, you look at it (peek). You cannot remove the bottom plate without taking off all plates above it!',
    lessons: [
      {
        title: 'The LIFO Principle',
        content: 'Stacks are linear collections where elements are added and removed from the same end, called the "top". The last element you add will always be the first one you retrieve.'
      },
      {
        title: 'Stack Operations',
        content: 'Push: Add an element to the top. Pop: Remove the top element and return it. Peek: View the top element without removing it. IsEmpty: Check if the stack contains any items.'
      }
    ],
    dryRun: {
      code: [
        'let s = [];',
        's.push(10);',
        's.push(20);',
        'let topVal = s.pop();',
        's.push(30);'
      ],
      steps: [
        { line: 0, vars: { s: [] }, desc: 'Initialize stack s as an empty array.' },
        { line: 1, vars: { s: [10] }, desc: 'Push 10 onto the stack s.' },
        { line: 2, vars: { s: [10, 20] }, desc: 'Push 20 onto the stack s. Top of the stack is now 20.' },
        { line: 3, vars: { s: [10], topVal: 20 }, desc: 'Pop the top element off. 20 is removed. Assign topVal = 20.' },
        { line: 4, vars: { s: [10, 30], topVal: 20 }, desc: 'Push 30 onto the stack s. Stack now contains [10, 30].' }
      ]
    }
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    desc: 'Classes, Objects, Inheritance, and Encapsulation paradigms.',
    difficulty: 'Hard',
    analogy: 'Imagine a blueprint for a car. The blueprint is the Class. It describes properties (color, speed) and actions (drive, brake). An actual car manufactured using that blueprint is an Object (an Instance). If we build a special "Electric Car" blueprint that inherits from the basic car blueprint, that is Inheritance!',
    lessons: [
      {
        title: 'Classes and Objects',
        content: 'A class is a template for creating objects. Objects are instances of a class that encapsulate data (fields/properties) and actions (methods).'
      },
      {
        title: 'Inheritance and Polymorphism',
        content: 'Inheritance allows a subclass to inherit properties and methods from a parent class. Polymorphism allows a subclass to provide a specific implementation of a method that is already defined in its parent class.'
      }
    ],
    dryRun: {
      code: [
        'class Robot {',
        '  constructor(name) { this.name = name; }',
        '}',
        'class FlyingRobot extends Robot {',
        '  constructor(name, wings) { super(name); this.wings = wings; }',
        '}',
        'let r = new FlyingRobot("Aero", 2);'
      ],
      steps: [
        { line: 6, vars: {}, desc: 'Instantiate FlyingRobot with name = "Aero" and wings = 2.' },
        { line: 4, vars: { name: 'Aero', wings: 2 }, desc: 'Call FlyingRobot constructor. Calls super(name).' },
        { line: 1, vars: { name: 'Aero' }, desc: 'Inside Robot constructor. Set this.name = "Aero".' },
        { line: 4, vars: { name: 'Aero', wings: 2, this_name: 'Aero' }, desc: 'Returned from super(). Set this.wings = 2.' },
        { line: 6, vars: { r: { name: 'Aero', wings: 2 } }, desc: 'Object fully instantiated and assigned to r.' }
      ]
    }
  }
];

const toTitleCaseDifficulty = (difficulty = 'Medium') =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

const normalizeTopic = topic => ({
  ...topic,
  description: topic.description || topic.desc,
  codeExample: topic.codeExample || (topic.dryRun?.code || []).join('\n'),
  analogy: typeof topic.analogy === 'string'
    ? {
        title: topic.title,
        story: topic.analogy,
        takeaway: `Connect the analogy back to ${topic.title} by identifying the data, operation, and stopping condition.`
      }
    : topic.analogy,
  dryRun: {
    ...topic.dryRun,
    steps: (topic.dryRun?.steps || []).map(step => ({
      ...step,
      explanation: step.explanation || step.desc,
      highlightLine: step.highlightLine || (typeof step.line === 'number' ? `Line ${step.line + 1}` : 'Concept focus')
    }))
  }
});

const scrapedTopicEntries = Object.entries(scrapedDsaData.topics || {});
const coreTopicIds = new Set(coreTopicsData.map(topic => topic.id));

const websiteTopicsData = scrapedTopicEntries
  .filter(([id]) => !coreTopicIds.has(id))
  .map(([id, topic], index) => {
    const primaryProblem = topic.problems?.[0];
    const codeSample = `// ${topic.title} practice starter\nfunction solve${topic.title.replace(/[^A-Za-z0-9]/g, '')}() {\n  // Pick one problem below and implement your approach.\n  return null;\n}`;

    return {
      id,
      title: topic.title,
      desc: primaryProblem?.desc || `Practice core ${topic.title} concepts with curated DSA problems.`,
      description: primaryProblem?.desc || `Practice core ${topic.title} concepts with curated DSA problems.`,
      difficulty: toTitleCaseDifficulty(primaryProblem?.difficulty),
      icon: topicIcons[index % topicIcons.length],
      codeExample: codeSample,
      lessons: [
        {
          title: `${topic.title} Problem Set`,
          content: `This module was imported from ${scrapedDsaData.source}. Start with ${primaryProblem?.title || 'the foundation problem'}, then work through the remaining problems by difficulty.`
        },
        {
          title: 'Practice Path',
          content: (topic.problems || []).map(problem => `${problem.title} (${toTitleCaseDifficulty(problem.difficulty)})`).join(' → ')
        }
      ],
      analogy: {
        title: `${topic.title} as a toolkit`,
        story: `Treat each ${topic.title} problem as a tool selection exercise: identify the input pattern, choose the right operation, and verify edge cases before coding.`,
        takeaway: 'Focus on why the technique fits before writing the implementation.'
      },
      dryRun: {
        code: codeSample.split('\n'),
        steps: [
          {
            line: 0,
            vars: { topic: topic.title },
            explanation: `Read the ${topic.title} prompt and identify the data structure or algorithm pattern.`,
            highlightLine: 'Problem pattern'
          },
          {
            line: 2,
            vars: { problems: topic.problems?.length || 0 },
            explanation: 'Choose a starter problem, define inputs and outputs, then write test cases.',
            highlightLine: 'Plan inputs and outputs'
          },
          {
            line: 3,
            vars: { status: 'ready' },
            explanation: 'Implement the solution and validate it against simple and edge-case examples.',
            highlightLine: 'Implementation'
          }
        ]
      }
    };
  });

export const topicsData = [
  ...coreTopicsData.map(normalizeTopic),
  ...websiteTopicsData.map(normalizeTopic)
];

const generatedPracticeQuestions = Object.fromEntries(
  websiteTopicsData.map(topic => [
    topic.id,
    [
      {
        id: `${topic.id}-website-practice`,
        title: `${topic.title} Starter Challenge`,
        difficulty: 'Basic',
        description: topic.description,
        prompt: `Choose one ${topic.title} problem from this module and implement a JavaScript solution. Start by writing clear inputs, outputs, and edge cases.`,
        initialCode: topic.codeExample,
        testCase: {
          fn: `solve${topic.title.replace(/[^A-Za-z0-9]/g, '')}`,
          cases: []
        },
        hints: [
          'Restate the problem in one sentence before coding.',
          'List the input size and expected output type.',
          'Write a simple example and one edge case.',
          'Choose the data structure or algorithm pattern before implementation.',
          'After coding, walk through the example manually and compare each variable change.'
        ]
      }
    ]
  ])
);

const generatedQuizzesData = Object.fromEntries(
  websiteTopicsData.map(topic => [
    topic.id,
    [
      {
        question: `What should you identify first when solving a ${topic.title} problem?`,
        options: ['The input pattern and constraints', 'The final CSS colors', 'The deployment provider', 'The file name only'],
        answer: 0
      },
      {
        question: `Why group problems under ${topic.title}?`,
        options: ['They share a reusable solving pattern', 'They must all use recursion', 'They avoid testing', 'They only run in the browser'],
        answer: 0
      }
    ]
  ])
);

const corePracticeQuestions = {
  loops: [
    {
      id: 'l1',
      title: 'Count Odd Numbers',
      difficulty: 'Basic',
      prompt: 'Write a function countOdds(n) that takes a number n and returns the count of odd numbers from 1 to n (inclusive).',
      initialCode: 'function countOdds(n) {\n  // Write code here\n  \n}',
      testCase: {
        fn: 'countOdds',
        cases: [
          { input: [5], expected: 3 },
          { input: [10], expected: 5 },
          { input: [1], expected: 1 }
        ]
      },
      hints: [
        'Initialize a count variable to 0.',
        'Use a for loop running from i = 1 up to n.',
        'To check if a number is odd, check if i % 2 !== 0.',
        'Increment your counter inside the if condition.',
        'Full solution:\nfunction countOdds(n) {\n  let count = 0;\n  for(let i=1; i<=n; i++) {\n    if(i % 2 !== 0) count++;\n  }\n  return count;\n}'
      ]
    },
    {
      id: 'l2',
      title: 'Sum of Evens',
      difficulty: 'Intermediate',
      prompt: 'Write a function sumEvens(start, end) that returns the sum of all even numbers between start and end (inclusive).',
      initialCode: 'function sumEvens(start, end) {\n  // Write code here\n  \n}',
      testCase: {
        fn: 'sumEvens',
        cases: [
          { input: [1, 5], expected: 6 }, // 2 + 4
          { input: [4, 10], expected: 28 }, // 4 + 6 + 8 + 10
          { input: [7, 7], expected: 0 }
        ]
      },
      hints: [
        'Create a sum variable set to 0.',
        'Iterate from start to end using a loop.',
        'Check if the current loop variable is even using modulo 2.',
        'Add even numbers to the sum.',
        'Full solution:\nfunction sumEvens(start, end) {\n  let sum = 0;\n  for(let i=start; i<=end; i++) {\n    if(i%2 === 0) sum += i;\n  }\n  return sum;\n}'
      ]
    }
  ],
  functions: [
    {
      id: 'f1',
      title: 'Calculate Discount',
      difficulty: 'Basic',
      prompt: 'Write a function getFinalPrice(price, discountPercent) that calculates and returns the final price after applying a discount. If the discount is invalid (negative or > 100), return the original price.',
      initialCode: 'function getFinalPrice(price, discountPercent) {\n  // Write code here\n  \n}',
      testCase: {
        fn: 'getFinalPrice',
        cases: [
          { input: [100, 10], expected: 90 },
          { input: [80, 150], expected: 80 },
          { input: [50, -5], expected: 50 }
        ]
      },
      hints: [
        'Check if discountPercent is less than 0 or greater than 100 first.',
        'If it is invalid, return the original price immediately.',
        'Calculate the discount amount: price * (discountPercent / 100).',
        'Subtract discount amount from the original price and return it.',
        'Full solution:\nfunction getFinalPrice(price, discount) {\n  if(discount < 0 || discount > 100) return price;\n  return price - (price * (discount / 100));\n}'
      ]
    }
  ],
  recursion: [
    {
      id: 'r1',
      title: 'Fibonacci Sequence',
      difficulty: 'Intermediate',
      prompt: 'Write a recursive function fibonacci(n) that returns the n-th Fibonacci number. Assume fibonacci(0) = 0 and fibonacci(1) = 1.',
      initialCode: 'function fibonacci(n) {\n  // Write recursive code here\n  \n}',
      testCase: {
        fn: 'fibonacci',
        cases: [
          { input: [0], expected: 0 },
          { input: [1], expected: 1 },
          { input: [6], expected: 8 }
        ]
      },
      hints: [
        'Identify base cases: if n is 0 return 0, if n is 1 return 1.',
        'For n > 1, the Fibonacci number is the sum of the two preceding numbers.',
        'Formulate the recursive relation: fibonacci(n - 1) + fibonacci(n - 2).',
        'Combine base cases and recursive call.',
        'Full solution:\nfunction fibonacci(n) {\n  if (n <= 0) return 0;\n  if (n === 1) return 1;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}'
      ]
    }
  ],
  stack: [
    {
      id: 's1',
      title: 'Valid Parentheses Check',
      difficulty: 'Tricky',
      prompt: 'Write a function isValidParentheses(str) that checks if brackets are balanced using a stack. The string only contains "(" and ")". Return true if balanced, false otherwise.',
      initialCode: 'function isValidParentheses(str) {\n  // Write stack logic here\n  \n}',
      testCase: {
        fn: 'isValidParentheses',
        cases: [
          { input: ["()()"], expected: true },
          { input: ["(()(()))"], expected: true },
          { input: ["(()"], expected: false }
        ]
      },
      hints: [
        'Create an empty array to represent a stack.',
        'Loop through the characters of the string.',
        'If you see an opening bracket "(", push it onto the stack.',
        'If you see a closing bracket ")", pop from the stack. If the stack is empty, return false.',
        'After loop, check if stack is empty. If yes return true, else false.\nFull solution:\nfunction isValidParentheses(str) {\n  let stack = [];\n  for(let c of str) {\n    if (c === "(") stack.push(c);\n    else {\n      if(stack.length === 0) return false;\n      stack.pop();\n    }\n  }\n  return stack.length === 0;\n}'
      ]
    }
  ],
  oop: [
    {
      id: 'o1',
      title: 'Define BankAccount Class',
      difficulty: 'Basic',
      prompt: 'Write a class BankAccount that takes owner and initialBalance. Implement methods deposit(amount) and withdraw(amount). withdraw should not allow overdraft (balance cannot go below 0).',
      initialCode: 'class BankAccount {\n  constructor(owner, balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n  // Implement deposit and withdraw methods here\n  \n}',
      testCase: {
        fn: 'BankAccountTest',
        cases: [
          { input: ["Gaurav", 100], expected: true } // Mock verification
        ]
      },
      hints: [
        'Inside the class, create deposit(amount) method that adds amount to this.balance.',
        'Create withdraw(amount) method.',
        'Inside withdraw, check if amount <= this.balance. If yes, subtract it.',
        'Otherwise, do not modify the balance (or log an error).',
        'Full solution:\nclass BankAccount {\n  constructor(owner, balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n  deposit(amount) {\n    this.balance += amount;\n  }\n  withdraw(amount) {\n    if(amount <= this.balance) this.balance -= amount;\n  }\n}'
      ]
    }
  ]
};

export const practiceQuestions = {
  ...generatedPracticeQuestions,
  ...corePracticeQuestions
};

const coreQuizzesData = {
  loops: [
    {
      question: 'Which loop is guaranteed to run at least once?',
      options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
      answer: 2
    },
    {
      question: 'What is the output of: for(let i=0; i<3; i++) { if(i===1) continue; console.log(i); }',
      options: ['0, 1, 2', '0, 2', '1, 2', '0, 1'],
      answer: 1
    }
  ],
  functions: [
    {
      question: 'What is returned by a function that has no return statement?',
      options: ['null', '0', 'undefined', 'void'],
      answer: 2
    },
    {
      question: 'Can a local variable inside a function have the same name as a global variable?',
      options: ['Yes, it shadows the global variable', 'No, it throws a redeclaration error', 'Yes, but they will merge values', 'No, only in strict mode'],
      answer: 0
    }
  ],
  recursion: [
    {
      question: 'What happens if a recursive function lacks a base case?',
      options: ['It returns null', 'It triggers stack overflow', 'It executes normally', 'It exits immediately'],
      answer: 1
    },
    {
      question: 'What structure is used by the computer to track recursive calls?',
      options: ['Heap', 'Queue', 'Call Stack', 'Hash Table'],
      answer: 2
    }
  ],
  stack: [
    {
      question: 'What is the time complexity of pushing an element onto a stack?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      answer: 0
    },
    {
      question: 'Which of the following is a practical use case of stack data structure?',
      options: ['Undo/redo history in editors', 'Browser tab history navigation', 'Matching parenthesis in compilers', 'All of the above'],
      answer: 3
    }
  ],
  oop: [
    {
      question: 'Which OOP concept hides internal state and exposes selected methods?',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
      answer: 2
    },
    {
      question: 'How does a child class call the constructor of a parent class in JavaScript?',
      options: ['parent()', 'super()', 'this.parent()', 'construct()'],
      answer: 1
    }
  ]
};

export const quizzesData = {
  ...generatedQuizzesData,
  ...coreQuizzesData
};

export const companyPacks = [
  {
    id: 'google',
    name: 'Google Interview Pack',
    cost: 150,
    questionsCount: 4,
    questions: [
      {
        title: 'Two Sum Problem',
        prompt: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        initialCode: 'function twoSum(nums, target) {\n  // Write O(n) solution using Map\n  \n}'
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        prompt: 'Find the length of the longest substring without repeating characters in a string s.',
        initialCode: 'function lengthOfLongestSubstring(s) {\n  \n}'
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft Interview Pack',
    cost: 100,
    questionsCount: 3,
    questions: [
      {
        title: 'Reverse Linked List',
        prompt: 'Reverse a singly linked list recursively or iteratively.',
        initialCode: 'function reverseList(head) {\n  \n}'
      }
    ]
  }
];
