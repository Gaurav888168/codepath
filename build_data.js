import fs from 'fs';

const scraped = JSON.parse(fs.readFileSync('scraped_data/kodin_dsa_data.json', 'utf-8'));

const visualizerMap = {
  timecomplexity: '/visualizers/time_complexity_foundation.html',
  greedy: '/visualizers/activity_selection.html',
  stack: '/visualizers/stack_foundation.html',
  queue: '/visualizers/queue_foundation.html',
  heap: '/visualizers/heap_foundation.html',
  linkedlist: '/visualizers/linked_list_foundation.html',
  binarytree: '/visualizers/tree_traversal.html',
  recursion: '/visualizers/recursion_visualizer.html',
  dynamic: '/visualizers/knapsack_01.html',
  array: '/visualizers/two_sum.html',
  graph: '/visualizers/dijkstras_algorithm.html',
  sorting: '/visualizers/array_foundation.html',
  searching: '/visualizers/time_complexity_foundation.html',
  string: '/visualizers/huffman_encoding.html',
  sliding: '/visualizers/maximum_subarray_sum.html',
  twopointer: '/visualizers/two_sum.html',
  divide: '/visualizers/recursion_visualizer.html',
  tree: '/visualizers/binary_tree_foundation.html'
};

const analogies = {
  timecomplexity: {
    title: 'Comparing Travel Methods',
    story: 'Walking 1km takes linear time O(n). Driving on highway takes logarithmic time O(log n). Teleporting is constant time O(1). Big-O explains runtime as distance grows!',
    takeaway: 'Big-O notation measures algorithm scalability as input size approaches infinity.'
  },
  array: {
    title: 'Numbered Locker Room',
    story: 'Array is a row of contiguous lockers. Known index gives instant O(1) access, but inserting in middle shifts all following lockers in O(n).',
    takeaway: 'Arrays give instant O(1) random access but require O(n) element shifting for mid-insertions.'
  },
  stack: {
    title: 'Stack of Dinner Plates',
    story: 'You place clean plates on top (push) and remove only from top (pop). The last plate added is always first washed (LIFO)!',
    takeaway: 'LIFO (Last-In-First-Out) is fundamental for undo/redo, call stacks, and matching brackets.'
  },
  queue: {
    title: 'Movie Ticket Line',
    story: 'First person in line is first person served (FIFO). Order and fairness are strictly maintained.',
    takeaway: 'FIFO (First-In-First-Out) is essential for task schedulers, print queues, and BFS traversal.'
  },
  linkedlist: {
    title: 'Treasure Hunt Clues',
    story: 'Each clue tells where you are and gives a pointer to where the NEXT clue is hidden. You follow clue by clue.',
    takeaway: 'Linked lists allow O(1) dynamic memory allocation without contiguous blocks, with O(n) sequential traversal.'
  },
  binarytree: {
    title: 'Corporate Hierarchy Tree',
    story: 'CEO at root, executives below with at most two direct teams (left/right). Information branches downward efficiently.',
    takeaway: 'Hierarchical branching gives logarithmic O(log n) search and insert in balanced trees.'
  },
  graph: {
    title: 'Flight Network & GPS Navigation',
    story: 'Cities are vertices, flights are weighted edges. Finding least-layover route is Dijkstra algorithm.',
    takeaway: 'Graphs model networks. BFS finds shortest hops, DFS explores complete paths, Dijkstra finds min cost.'
  },
  dynamic: {
    title: 'Writing on a Notepad vs Recalculating',
    story: 'If you calculate 1+1+1+1=4, and someone adds +1, you instantly answer 5 because you remembered past result (Memoization).',
    takeaway: 'DP breaks problems into overlapping subproblems and stores intermediate results in a table.'
  },
  greedy: {
    title: 'Making Cash Change',
    story: 'To give 87 cents change, greedily take largest coin first (50c), then (25c), then (10c), then (2c).',
    takeaway: 'Greedy algorithms make immediate best local choices at each step without backtracking.'
  },
  heap: {
    title: 'Hospital Emergency Room Triage',
    story: 'Patients are treated not by arrival time, but by emergency severity priority at top of queue.',
    takeaway: 'Heaps maintain minimum or maximum element at root in O(1) retrieval and O(log n) insert.'
  }
};

const defaultAnalogy = {
  title: 'Step-by-Step Problem Solving',
  story: 'Breaking complex challenges into systematic steps and patterns makes any coding problem manageable.',
  takeaway: 'Mastering algorithmic fundamentals leads to optimal software performance.'
};

const topicsList = Object.entries(scraped.topics).map(([key, item]) => {
  const problems = item.problems || [];
  return {
    id: key,
    title: item.title,
    desc: problems[0] ? problems[0].desc : 'Explore fundamental operations and algorithmic techniques.',
    difficulty: problems[0]?.difficulty === 'hard' ? 'Hard' : problems[0]?.difficulty === 'medium' ? 'Medium' : 'Easy',
    visualizer: visualizerMap[key] || '/visualizers/time_complexity_foundation.html',
    analogy: analogies[key] || defaultAnalogy,
    codeExample: `// ${item.title} Core Template\nfunction solve(input) {\n  console.log('Processing:', input);\n  return true;\n}`,
    dryRun: {
      steps: [
        { highlightLine: 'solve(input)', explanation: `Initialize inputs and prepare data structures for ${item.title}.` },
        { highlightLine: 'return true;', explanation: 'Execute optimal algorithmic step and return result.' }
      ]
    }
  };
});

const practiceQuestions = {};
Object.entries(scraped.topics).forEach(([key, item]) => {
  const probs = item.problems || [];
  practiceQuestions[key] = [
    {
      difficulty: 'Basic',
      title: probs[0]?.title || `${item.title} Foundation`,
      description: probs[0]?.desc || 'Core fundamental problem.',
      starterCode: `function solve(arr) {\n  // Write solution\n  return arr;\n}\n\nconsole.log(solve([1, 2, 3]));`
    },
    {
      difficulty: 'Intermediate',
      title: probs[1]?.title || `${item.title} Application`,
      description: probs[1]?.desc || 'Intermediate problem with optimal time complexity.',
      starterCode: `function solve(input) {\n  // Optimal solution\n  return input;\n}\n\nconsole.log(solve([4, 5, 6]));`
    },
    {
      difficulty: 'Advanced',
      title: probs[2]?.title || `${item.title} Optimization`,
      description: probs[2]?.desc || 'Advanced interview problem.',
      starterCode: `function solve(data) {\n  // Advanced algorithmic logic\n  return data;\n}\n\nconsole.log(solve([7, 8, 9]));`
    }
  ];
});

const quizzesData = {};
Object.entries(scraped.topics).forEach(([key, item]) => {
  quizzesData[key] = [
    {
      question: `What is the primary advantage of utilizing ${item.title}?`,
      options: ['Optimal time/space complexity', 'Simpler syntax only', 'Reduces lines of code', 'None of the above'],
      answer: 0
    },
    {
      question: `In which scenario is ${item.title} most effective?`,
      options: ['Unstructured random data', 'Matching structural problem patterns', 'When memory is unlimited', 'Exclusively in recursion'],
      answer: 1
    }
  ];
});

const companyPacks = [
  {
    id: 'google',
    name: 'Google Interview Pack',
    cost: 150,
    questionsCount: 4,
    questions: [
      {
        title: 'Two Sum Problem',
        prompt: 'Given an array of integers nums and target, return indices of two numbers that add up to target.',
        initialCode: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}'
      },
      {
        title: '0/1 Knapsack Problem',
        prompt: 'Find maximum value in knapsack of capacity W.',
        initialCode: 'function knapsack(weights, values, W) {\n  \n}'
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
        initialCode: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}'
      },
      {
        title: 'Valid Parentheses',
        prompt: 'Check if input string with brackets is balanced.',
        initialCode: 'function isValid(s) {\n  \n}'
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon Interview Pack',
    cost: 120,
    questionsCount: 3,
    questions: [
      {
        title: 'Dijkstra Shortest Path',
        prompt: 'Find shortest paths from source vertex in weighted graph.',
        initialCode: 'function dijkstra(graph, start) {\n  \n}'
      },
      {
        title: 'Top K Frequent Elements',
        prompt: 'Return k most frequent elements in array.',
        initialCode: 'function topKFrequent(nums, k) {\n  \n}'
      }
    ]
  }
];

const content = `// Auto-generated & integrated with Kodin DSA Curriculum & Visualizers
export const topicsData = ${JSON.stringify(topicsList, null, 2)};

export const practiceQuestions = ${JSON.stringify(practiceQuestions, null, 2)};

export const quizzesData = ${JSON.stringify(quizzesData, null, 2)};

export const companyPacks = ${JSON.stringify(companyPacks, null, 2)};
`;

fs.writeFileSync('src/data.js', content, 'utf-8');
console.log(`✅ Generated src/data.js with ${topicsList.length} topics!`);
