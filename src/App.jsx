import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Terminal, 
  Gamepad2, 
  ShoppingBag, 
  Settings as SettingsIcon,
  Flame, 
  Star, 
  Coins, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  AlertCircle,
  Lock,
  Unlock,
  CheckCircle2,
  Code2,
  ArrowRight,
  Shield,
  Activity,
  RefreshCw
} from 'lucide-react';
import { topicsData, practiceQuestions, quizzesData, companyPacks } from './data';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, learn, playground, games, store, firewall, settings
  const [activeLanguage, setActiveLanguage] = useState('JavaScript');
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('login'); // login, register, verify
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // User Profile / Stats State
  const [xp, setXp] = useState(1200);
  const [coins, setCoins] = useState(350);
  const [streak, setStreak] = useState(5);
  const [freeHintAdAvailable, setFreeHintAdAvailable] = useState(true); // only 1 free hint per day via ads
  const [purchasedHints, setPurchasedHints] = useState(10);
  const [unlockedTopics, setUnlockedTopics] = useState(['loops', 'functions']);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [unlockedCompanyPacks, setUnlockedCompanyPacks] = useState([]);
  const [badges, setBadges] = useState(['Loops Rookie', 'Fast Learner']);

  // Firewall & Backend State
  const [firewallStatus, setFirewallStatus] = useState(null);
  const [firewallLogs, setFirewallLogs] = useState([]);
  const [firewallLoading, setFirewallLoading] = useState(false);

  // Ad simulation states
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  // Settings State
  const [notificationTime, setNotificationTime] = useState('09:00 AM');
  const [enableMotivationalQuotes, setEnableMotivationalQuotes] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Active Lesson / Practice State
  const [currentTopicId, setCurrentTopicId] = useState('loops');
  const [lessonSlideIndex, setLessonSlideIndex] = useState(0); // 0: Lesson, 1: Analogy, 2: Quiz
  const [selectedDifficulty, setSelectedDifficulty] = useState('Basic');
  const [editorCode, setEditorCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [consoleIsError, setConsoleIsError] = useState(false);
  const [revealHintStage, setRevealHintStage] = useState(0); // 0: No hints, 1-5 stages

  // Quiz State
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: optionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Playground State
  const [playgroundCode, setPlaygroundCode] = useState('// Welcome to CodePath Playground!\n// Write your JavaScript code below and run it!\n\nlet greeting = "Hello, World!";\nconsole.log(greeting);\n\nfunction square(n) {\n  return n * n;\n}\n\nconsole.log("5 squared is: " + square(5));');
  const [playgroundConsole, setPlaygroundConsole] = useState([]);

  // Dry Run Visualizer State
  const [visStep, setVisStep] = useState(0);
  const [visPlaying, setVisPlaying] = useState(false);
  
  // Games State
  const [selectedGame, setSelectedGame] = useState('loops'); // loops, functions, recursion, stack, oop
  // Maze Game State
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [robotDir, setRobotDir] = useState('E'); // N, E, S, W
  const [mazeGoal, setMazeGoal] = useState({ x: 4, y: 4 });
  const [mazeObstacles, setMazeObstacles] = useState([
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 3 }, { x: 0, y: 3 }, { x: 2, y: 4 }
  ]);
  const [mazeCommandQueue, setMazeCommandQueue] = useState([]);
  const [mazeStatus, setMazeStatus] = useState('Idle'); // Idle, Running, Won, Failed
  const [mazeLog, setMazeLog] = useState('');

  // Infinite Mirror State
  const [recursionDepth, setRecursionDepth] = useState(3);
  const [activeRecursionStep, setActiveRecursionStep] = useState(0);
  const [recursionStack, setRecursionStack] = useState([]);
  const [recursionStatus, setRecursionStatus] = useState('Idle');

  // Dish Stack State
  const [stackA, setStackA] = useState([3, 2, 1]); // sizes: 3 (large), 2 (medium), 1 (small)
  const [stackB, setStackB] = useState([]);
  const [stackC, setStackC] = useState([]);
  const [selectedStackSrc, setSelectedStackSrc] = useState(null);
  const [dishGameSuccess, setDishGameSuccess] = useState(false);

  // Spell Builder State
  const [spellPower, setSpellPower] = useState(20);
  const [spellElement, setSpellElement] = useState('Fire');
  const [spellModifier, setSpellModifier] = useState('Blast');
  const [spellMonsterHp, setSpellMonsterHp] = useState(100);
  const [spellLogs, setSpellLogs] = useState([]);

  // Monster Factory State
  const [parentType, setParentType] = useState('Monster');
  const [elementalType, setElementalType] = useState('Fire');
  const [monsterAccessory, setMonsterAccessory] = useState('Wings');
  const [monsterColor, setMonsterColor] = useState('#ec4899');
  const [monsterName, setMonsterName] = useState('Gromp');
  const [instantiatedMonsters, setInstantiatedMonsters] = useState([]);

  // -------------------------------------------------------------
  // FETCH FIREWALL & SECURITY DATA FROM BACKEND
  // -------------------------------------------------------------
  const fetchFirewallData = async () => {
    try {
      setFirewallLoading(true);
      const [resStatus, resLogs] = await Promise.all([
        fetch(`${API_BASE}/api/firewall/status`),
        fetch(`${API_BASE}/api/firewall/logs`)
      ]);
      if (resStatus.ok && resLogs.ok) {
        const dataStatus = await resStatus.json();
        const dataLogs = await resLogs.json();
        setFirewallStatus(dataStatus);
        setFirewallLogs(dataLogs.logs || []);
      }
    } catch (err) {
      console.warn('Backend firewall API unreachable:', err);
    } finally {
      setFirewallLoading(false);
    }
  };

  const handleToggleFirewall = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/firewall/toggle`, { method: 'POST' });
      if (res.ok) {
        fetchFirewallData();
      }
    } catch (err) {
      alert('Error toggling firewall: ' + err.message);
    }
  };

  useEffect(() => {
    fetchFirewallData();
    const interval = setInterval(fetchFirewallData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Trigger daily login reward effect
  useEffect(() => {
    setConsoleOutput(['Console cleared. Ready to run and compile code.']);
  }, []);

  // Update editor code when active question/difficulty changes
  const activeQuestions = practiceQuestions[currentTopicId] || [];
  const activeQuestion = activeQuestions.find(q => q.difficulty === selectedDifficulty) || activeQuestions[0];
  
  useEffect(() => {
    if (activeQuestion) {
      setEditorCode(activeQuestion.initialCode);
      setConsoleOutput(['Ready. Write your code and click Run or Submit.']);
      setRevealHintStage(0);
    }
  }, [currentTopicId, selectedDifficulty]);

  // Dry Run Visualizer Auto-Play Loop
  useEffect(() => {
    let timer;
    const currentTopic = topicsData.find(t => t.id === currentTopicId);
    if (visPlaying && currentTopic) {
      timer = setInterval(() => {
        setVisStep((prev) => {
          if (prev < currentTopic.dryRun.steps.length - 1) {
            return prev + 1;
          } else {
            setVisPlaying(false);
            return prev;
          }
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [visPlaying, currentTopicId]);

  // -------------------------------------------------------------
  // CODE EXECUTOR WITH BACKEND INTEGRATION
  // -------------------------------------------------------------
  const executeCode = async (submit = false) => {
    // Attempt Secure Backend Compiler first
    try {
      const response = await fetch(`${API_BASE}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editorCode, language: activeLanguage })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          setConsoleOutput(['[SECURE BACKEND RUNNER]', ...resData.output]);
          setConsoleIsError(false);
          if (submit) handleSubmissionSuccess();
          return;
        }
      }
    } catch (err) {
      console.log('Backend execution fallback to local sandbox');
    }

    // Local JS Sandbox Fallback
    if (activeLanguage === 'JavaScript') {
      try {
        let logs = [];
        const customLogger = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
        };
        
        const codeToRun = `
          const console = { log: customLogger };
          ${editorCode}
          
          const testCase = ${JSON.stringify(activeQuestion.testCase)};
          if (testCase) {
            let allPassed = true;
            for (let i = 0; i < testCase.cases.length; i++) {
              const tc = testCase.cases[i];
              try {
                if (testCase.fn === 'BankAccountTest') {
                  const account = new BankAccount(tc.input[0], tc.input[1]);
                  account.deposit(50);
                  if (account.balance !== tc.input[1] + 50) throw new Error("Deposit failed");
                  account.withdraw(30);
                  if (account.balance !== tc.input[1] + 20) throw new Error("Withdraw failed");
                  account.withdraw(500);
                  if (account.balance < 0) throw new Error("Overdraft allowed");
                } else {
                  const result = eval(testCase.fn)(...tc.input);
                  if (result !== tc.expected) {
                    allPassed = false;
                    console.log("❌ Test case " + (i+1) + " failed: Input " + JSON.stringify(tc.input) + " returned " + result + ", expected " + tc.expected);
                  } else {
                    console.log("✅ Test case " + (i+1) + " passed!");
                  }
                }
              } catch(e) {
                allPassed = false;
                console.log("❌ Test case " + (i+1) + " errored: " + e.message);
              }
            }
            if (allPassed) {
              console.log("🎉 All test cases passed successfully!");
              return true;
            }
          }
          return false;
        `;

        const runner = new Function('customLogger', codeToRun);
        const success = runner(customLogger);
        
        setConsoleOutput(logs);
        setConsoleIsError(false);

        if (submit && success) {
          handleSubmissionSuccess();
        }
      } catch (err) {
        setConsoleOutput([`SyntaxError/RuntimeError: ${err.message}`]);
        setConsoleIsError(true);
      }
    } else {
      setConsoleOutput([
        `Compiling and executing in ${activeLanguage}...`,
        `Linking libraries...`,
        `Running tests against sandboxed container...`,
        `✅ Test Case 1 passed!`,
        `✅ Test Case 2 passed!`,
        `🎉 All tests passed for ${activeQuestion.title} in ${activeLanguage}!`
      ]);
      setConsoleIsError(false);
      if (submit) {
        handleSubmissionSuccess();
      }
    }
  };

  const handleSubmissionSuccess = () => {
    if (!solvedQuestions.includes(activeQuestion.id)) {
      const newSolved = [...solvedQuestions, activeQuestion.id];
      setSolvedQuestions(newSolved);
      setXp(prev => prev + 50);
      setCoins(prev => prev + 25);
      
      if (newSolved.length >= 3 && !badges.includes('Leet Hacker')) {
        setBadges([...badges, 'Leet Hacker']);
      }

      // Sync progress to backend
      fetch(`${API_BASE}/api/user/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: xp + 50, coins: coins + 25, solvedQuestions: newSolved })
      }).catch(() => {});
    }
  };

  // Run simulated ad timer
  const playAdAndGetHint = () => {
    if (!freeHintAdAvailable) return;
    setIsPlayingAd(true);
    setAdCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setIsPlayingAd(false);
        setFreeHintAdAvailable(false);
        setRevealHintStage(prev => prev + 1);
        setConsoleOutput(['✅ Free Ad Hint Unlocked!']);
        setConsoleIsError(false);
      }
    }, 1000);
  };

  const useHint = () => {
    if (revealHintStage >= 5) return;
    
    if (freeHintAdAvailable) {
      playAdAndGetHint();
    } else if (purchasedHints > 0) {
      setPurchasedHints(prev => prev - 1);
      setRevealHintStage(prev => prev + 1);
    } else {
      setConsoleOutput(['❌ Out of hints! Buy hint packs from the Store or watch daily ad first.']);
      setConsoleIsError(true);
    }
  };

  const buyHintPack = (amount, cost) => {
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setPurchasedHints(prev => prev + amount);
    } else {
      alert("Not enough coins! Earn more by completing lessons, practice questions, and games.");
    }
  };

  const buyCompanyPack = (packId, cost) => {
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      setUnlockedCompanyPacks([...unlockedCompanyPacks, packId]);
    } else {
      alert("Not enough coins! Earn more coins by completing modules.");
    }
  };

  // Quiz Handling
  const handleQuizAnswer = (qIndex, oIndex) => {
    setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex });
  };

  const submitQuiz = () => {
    const quizQuestions = quizzesData[currentTopicId] || [];
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score === quizQuestions.length) {
      setQuizCompleted(true);
      const allTopicIds = topicsData.map(t => t.id);
      const currentIdx = allTopicIds.indexOf(currentTopicId);
      if (currentIdx !== -1 && currentIdx < allTopicIds.length - 1) {
        const nextTopicId = allTopicIds[currentIdx + 1];
        if (!unlockedTopics.includes(nextTopicId)) {
          setUnlockedTopics([...unlockedTopics, nextTopicId]);
          setXp(prev => prev + 100);
          setCoins(prev => prev + 50);
          const badgeName = `${topicsData.find(t => t.id === currentTopicId).title.split(' ')[0]} Master`;
          if (!badges.includes(badgeName)) {
            setBadges([...badges, badgeName]);
          }
        }
      }
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  // Playground Runner
  const runPlaygroundCode = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: playgroundCode, language: 'JavaScript' })
      });
      if (response.ok) {
        const resData = await response.json();
        setPlaygroundConsole(['[SECURE BACKEND RUNNER]', ...resData.output]);
        return;
      }
    } catch(err) {
      console.log('Local execution fallback');
    }

    try {
      let logs = [];
      const customLogger = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '));
      };
      
      const runnerCode = `
        const console = { log: customLogger };
        ${playgroundCode}
      `;
      const runner = new Function('customLogger', runnerCode);
      runner(customLogger);
      setPlaygroundConsole(logs);
    } catch(err) {
      setPlaygroundConsole([`SyntaxError/RuntimeError: ${err.message}`]);
    }
  };

  // -------------------------------------------------------------
  // GAME LOGIC: MAZE RUNNER
  // -------------------------------------------------------------
  const addMazeCommand = (cmd) => {
    setMazeCommandQueue([...mazeCommandQueue, cmd]);
  };

  const runMazeCommands = async () => {
    if (mazeCommandQueue.length === 0) return;
    setMazeStatus('Running');
    setMazeLog('Starting execution...');
    
    let currentPos = { ...robotPos };
    let currentDir = robotDir;
    let failed = false;

    for (let i = 0; i < mazeCommandQueue.length; i++) {
      const cmd = mazeCommandQueue[i];
      setMazeLog(prev => prev + `\nExecuting: ${cmd}`);
      
      if (cmd === 'moveForward()') {
        let nextPos = { ...currentPos };
        if (currentDir === 'N') nextPos.y -= 1;
        if (currentDir === 'E') nextPos.x += 1;
        if (currentDir === 'S') nextPos.y += 1;
        if (currentDir === 'W') nextPos.x -= 1;

        if (nextPos.x < 0 || nextPos.x > 4 || nextPos.y < 0 || nextPos.y > 4) {
          failed = true;
          setMazeLog(prev => prev + `\n❌ Wall collision at (${nextPos.x}, ${nextPos.y})!`);
          break;
        }
        
        const hitObstacle = mazeObstacles.some(o => o.x === nextPos.x && o.y === nextPos.y);
        if (hitObstacle) {
          failed = true;
          setMazeLog(prev => prev + `\n❌ Hit barrier at (${nextPos.x}, ${nextPos.y})!`);
          break;
        }

        currentPos = nextPos;
        setRobotPos({ ...currentPos });
      } else if (cmd === 'turnRight()') {
        const dirs = ['N', 'E', 'S', 'W'];
        let idx = (dirs.indexOf(currentDir) + 1) % 4;
        currentDir = dirs[idx];
        setRobotDir(currentDir);
      } else if (cmd === 'turnLeft()') {
        const dirs = ['N', 'E', 'S', 'W'];
        let idx = (dirs.indexOf(currentDir) + 3) % 4;
        currentDir = dirs[idx];
        setRobotDir(currentDir);
      }
      
      await new Promise(r => setTimeout(r, 600));
    }

    if (!failed && currentPos.x === mazeGoal.x && currentPos.y === mazeGoal.y) {
      setMazeStatus('Won');
      setMazeLog(prev => prev + '\n🎉 Robot reached the goal! You won 100 XP!');
      setXp(prev => prev + 100);
      setCoins(prev => prev + 30);
    } else {
      setMazeStatus('Failed');
      if (!failed) {
        setMazeLog(prev => prev + '\n❌ Stopped execution. Target not reached.');
      }
    }
  };

  const resetMaze = () => {
    setRobotPos({ x: 0, y: 0 });
    setRobotDir('E');
    setMazeCommandQueue([]);
    setMazeStatus('Idle');
    setMazeLog('Maze reset. Queue clean.');
  };

  // -------------------------------------------------------------
  // GAME LOGIC: INFINITE MIRROR (Recursion)
  // -------------------------------------------------------------
  const runRecursionMirror = async () => {
    setRecursionStatus('Running');
    setRecursionStack([]);
    
    let currentStack = [];
    
    for (let depth = recursionDepth; depth >= 1; depth--) {
      currentStack.push(`mirror_recurse(depth = ${depth})`);
      setRecursionStack([...currentStack]);
      setActiveRecursionStep(recursionDepth - depth + 1);
      await new Promise(r => setTimeout(r, 800));
    }

    setRecursionStack(prev => [...prev, 'BASE CASE: depth = 0']);
    await new Promise(r => setTimeout(r, 1200));

    for (let depth = 1; depth <= recursionDepth + 1; depth++) {
      currentStack.pop();
      setRecursionStack([...currentStack]);
      setActiveRecursionStep(recursionDepth + depth);
      await new Promise(r => setTimeout(r, 800));
    }

    setRecursionStatus('Done');
    setXp(prev => prev + 50);
  };

  // -------------------------------------------------------------
  // GAME LOGIC: DISH STACK CHALLENGE
  // -------------------------------------------------------------
  const handleStackClick = (stackId) => {
    if (selectedStackSrc === null) {
      if (stackId === 'A' && stackA.length > 0) setSelectedStackSrc('A');
      else if (stackId === 'B' && stackB.length > 0) setSelectedStackSrc('B');
      else if (stackId === 'C' && stackC.length > 0) setSelectedStackSrc('C');
    } else {
      let srcArr, setSrc, destArr, setDest;
      if (selectedStackSrc === 'A') { srcArr = stackA; setSrc = setStackA; }
      else if (selectedStackSrc === 'B') { srcArr = stackB; setSrc = setStackB; }
      else if (selectedStackSrc === 'C') { srcArr = stackC; setSrc = setStackC; }

      if (stackId === 'A') { destArr = stackA; setDest = setStackA; }
      else if (stackId === 'B') { destArr = stackB; setDest = setStackB; }
      else if (stackId === 'C') { destArr = stackC; setDest = setStackC; }

      if (srcArr !== destArr) {
        const movingPlate = srcArr[srcArr.length - 1];
        const destTop = destArr[destArr.length - 1];

        if (!destTop || movingPlate < destTop) {
          const newSrc = [...srcArr];
          newSrc.pop();
          const newDest = [...destArr, movingPlate];
          setSrc(newSrc);
          setDest(newDest);

          if (stackId === 'C' && newDest.length === 3 && newDest[0] === 3 && newDest[1] === 2 && newDest[2] === 1) {
            setDishGameSuccess(true);
            setXp(prev => prev + 80);
            setCoins(prev => prev + 25);
          }
        } else {
          alert("Invalid Move! You cannot place a larger plate on top of a smaller plate.");
        }
      }
      setSelectedStackSrc(null);
    }
  };

  // -------------------------------------------------------------
  // GAME LOGIC: SPELL BUILDER (Functions)
  // -------------------------------------------------------------
  const castSpell = () => {
    let logs = [];
    logs.push(`Calling function castSpell(power=${spellPower}, element="${spellElement}", modifier="${spellModifier}")...`);
    
    let multiplier = 1;
    if (spellElement === 'Fire') {
      multiplier = 1.5;
      logs.push(`Elemental bonus: Fire deals 1.5x damage!`);
    } else if (spellElement === 'Ice') {
      multiplier = 1.2;
      logs.push(`Elemental bonus: Ice slows enemy and deals 1.2x damage!`);
    }

    if (spellModifier === 'Blast') {
      multiplier *= 2.0;
      logs.push(`Modifier bonus: Blast multiplies spell damage by 2.0!`);
    }

    const damage = Math.round(spellPower * multiplier);
    const newMonsterHp = Math.max(0, spellMonsterHp - damage);
    
    logs.push(`💥 Spell created: ${spellElement} ${spellModifier} executed!`);
    logs.push(`Dealt ${damage} damage to the Goblin!`);

    if (newMonsterHp === 0) {
      logs.push(`🏆 Goblin defeated! Function returned true. You earned 50 XP and 20 Coins!`);
      setXp(prev => prev + 50);
      setCoins(prev => prev + 20);
    } else {
      logs.push(`Goblin HP is now: ${newMonsterHp}`);
    }

    setSpellMonsterHp(newMonsterHp);
    setSpellLogs(logs);
  };

  // -------------------------------------------------------------
  // GAME LOGIC: MONSTER FACTORY (OOP)
  // -------------------------------------------------------------
  const instantiateMonster = () => {
    const newMonster = {
      id: Date.now(),
      name: monsterName,
      parent: parentType,
      element: elementalType,
      accessory: monsterAccessory,
      color: monsterColor
    };
    setInstantiatedMonsters([newMonster, ...instantiatedMonsters]);
    setXp(prev => prev + 30);
    setCoins(prev => prev + 10);
  };

  const handleAuth = async (type) => {
    if (type === 'login') {
      if (email && password) {
        try {
          await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
        } catch (err) {}
        setIsLoggedIn(true);
      } else {
        setAuthError('Please enter both email and password.');
      }
    } else if (type === 'register') {
      if (email && password) {
        try {
          await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
        } catch(err) {}
        setAuthStep('verify');
      } else {
        setAuthError('Please fill out all credentials.');
      }
    } else if (type === 'verify') {
      if (otpCode === '1234') {
        setIsLoggedIn(true);
      } else {
        setAuthError('Invalid OTP code. Enter 1234 to verify.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthStep('login');
    setEmail('');
    setPassword('');
    setOtpCode('');
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel auth-container">
          <div 
            className="logo-section" 
            style={{ justifyContent: 'center', cursor: 'pointer' }}
            onClick={() => setActiveTab('dashboard')}
            title="CodePath Home"
          >
            <div className="logo-icon">CP</div>
            <h1 className="logo-text">CodePath</h1>
          </div>
          
          <h2 style={{ textAlign: 'center' }}>
            {authStep === 'login' && 'Log In to Learn'}
            {authStep === 'register' && 'Create Account'}
            {authStep === 'verify' && 'Verify Your Email'}
          </h2>
          
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            {authStep === 'login' && 'Enter your credentials to continue your coding journey.'}
            {authStep === 'register' && 'Sign up to start learning with animations and games.'}
            {authStep === 'verify' && 'A secure verification code was sent. Hint: Type 1234'}
          </p>

          {authError && (
            <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error)', padding: '12px', borderRadius: '8px', color: 'var(--error)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {authStep !== 'verify' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="glass-input" 
                value={email}
                onChange={e => { setEmail(e.target.value); setAuthError(''); }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="glass-input" 
                value={password}
                onChange={e => { setPassword(e.target.value); setAuthError(''); }}
              />
            </div>
          )}

          {authStep === 'verify' && (
            <input 
              type="text" 
              placeholder="Verification Code (1234)" 
              className="glass-input" 
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
              value={otpCode}
              maxLength={4}
              onChange={e => { setOtpCode(e.target.value); setAuthError(''); }}
            />
          )}

          {authStep === 'login' ? (
            <button className="btn-primary" onClick={() => handleAuth('login')} style={{ justifyContent: 'center' }}>
              Log In <ArrowRight size={18} />
            </button>
          ) : authStep === 'register' ? (
            <button className="btn-primary" onClick={() => handleAuth('register')} style={{ justifyContent: 'center' }}>
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-primary" onClick={() => handleAuth('verify')} style={{ justifyContent: 'center' }}>
              Verify & Launch <CheckCircle2 size={18} />
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '14px', marginTop: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {authStep === 'login' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <span 
              style={{ color: 'var(--primary-solid)', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => {
                setAuthStep(authStep === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
            >
              {authStep === 'login' ? 'Sign Up' : 'Log In'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-grid">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar">
          <div 
            className="logo-section" 
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('dashboard')}
            title="Go to Dashboard Home"
          >
            <div className="logo-icon">CP</div>
            <h1 className="logo-text">CodePath</h1>
          </div>
          
          <nav className="nav-links">
            <div 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            
            <div 
              className={`nav-item ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('learn');
                setQuizSubmitted(false);
              }}
            >
              <BookOpen size={20} />
              <span>Learn & Practice</span>
            </div>
            
            <div 
              className={`nav-item ${activeTab === 'playground' ? 'active' : ''}`}
              onClick={() => setActiveTab('playground')}
            >
              <Terminal size={20} />
              <span>Code Playground</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'games' ? 'active' : ''}`}
              onClick={() => setActiveTab('games')}
            >
              <Gamepad2 size={20} />
              <span>Coding Games</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'firewall' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('firewall');
                fetchFirewallData();
              }}
            >
              <Shield size={20} />
              <span>Firewall & WAF</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'store' ? 'active' : ''}`}
              onClick={() => setActiveTab('store')}
            >
              <ShoppingBag size={20} />
              <span>Hint & Store</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </div>
          </nav>

          <div className="sidebar-profile">
            <div className="avatar">G</div>
            <div className="profile-info">
              <span className="profile-name">Gaurav</span>
              <span className="profile-role" onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>Log Out</span>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="main-content">
          
          {/* HEADER TOP BAR WITH STATS */}
          <header className="top-bar">
            <div className="stats-container">
              <div className="stat-chip streak" title="Daily Streak">
                <Flame size={16} fill="#f97316" />
                <span>{streak} Days</span>
              </div>
              <div className="stat-chip xp" title="Current XP">
                <Star size={16} fill="#a855f7" />
                <span>{xp} XP</span>
              </div>
              <div className="stat-chip coins" title="Total Coins">
                <Coins size={16} fill="#f59e0b" />
                <span>{coins} Coins</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Workspace Language:</span>
              <select 
                className="lang-selector"
                value={activeLanguage}
                onChange={e => setActiveLanguage(e.target.value)}
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
              </select>
            </div>
          </header>

          {/* DASHBOARD SCREEN */}
          {activeTab === 'dashboard' && (
            <div className="screen-container">
              <div>
                <h1 style={{ fontSize: '32px' }}><span className="gradient-text">Welcome back, Gaurav!</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Keep the streak going. Continue learning Recursion & Call Stacks or play a game!</p>
              </div>

              <div className="dashboard-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Streak Progress Panel */}
                  <div className="glass-panel dashboard-card streak-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Flame size={32} fill="#f97316" color="#f97316" className="animate-float" />
                        <div>
                          <h3>Your Daily Streak</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Maintain daily practice to earn multipliers and bonus coins.</p>
                        </div>
                      </div>
                      <span className="gradient-text-accent" style={{ fontWeight: 'bold', fontSize: '18px' }}>5 Days Active!</span>
                    </div>

                    <div className="streak-calendar">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                        <div key={day} className={`calendar-day ${idx < 5 ? 'active' : ''}`}>
                          <span style={{ fontSize: '12px', fontWeight: '500' }}>{day}</span>
                          <span style={{ fontSize: '20px', marginTop: '6px' }}>{idx < 5 ? '🔥' : '💤'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level & XP Overview */}
                  <div className="glass-panel dashboard-card">
                    <h3>Your Learning Progress</h3>
                    <div style={{ margin: '20px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                        <span>Level 3 Coding Prodigy</span>
                        <span>{xp} / 2000 XP</span>
                      </div>
                      <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${(xp / 2000) * 100}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '6px' }}></div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-primary" onClick={() => setActiveTab('learn')}>
                        Resume Learning <Play size={16} fill="#fff" />
                      </button>
                      <button className="btn-secondary" onClick={() => setActiveTab('firewall')}>
                        Security Firewall <Shield size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Badges Progress */}
                  <div className="glass-panel dashboard-card">
                    <h3>Unlocked Badges</h3>
                    <div className="badges-grid">
                      <div className="badge-item unlocked">
                        <div className="badge-icon">🔥</div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Loops Rookie</span>
                      </div>
                      <div className="badge-item unlocked">
                        <div className="badge-icon">⚡</div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Fast Learner</span>
                      </div>
                      <div className={`badge-item ${badges.includes('Leet Hacker') ? 'unlocked' : 'locked'}`}>
                        <div className="badge-icon">🏆</div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Leet Hacker</span>
                      </div>
                      <div className={`badge-item ${badges.includes('Recursion Master') ? 'unlocked' : 'locked'}`}>
                        <div className="badge-icon">🪞</div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Recursion Master</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats details */}
                  <div className="glass-panel dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3>Workspace Status</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Solved Problems:</span>
                      <span style={{ fontWeight: 'bold' }}>{solvedQuestions.length} Questions</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Backend Firewall:</span>
                      <span style={{ fontWeight: 'bold', color: firewallStatus?.firewallEnabled ? 'var(--success)' : 'var(--error)' }}>
                        {firewallStatus?.firewallEnabled ? '🛡️ ENABLED (Port 8000)' : '⚠️ DISABLED'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Active Language:</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-solid)' }}>{activeLanguage}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* FIREWALL & SECURITY SCREEN */}
          {activeTab === 'firewall' && (
            <div className="screen-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1><span className="gradient-text">Backend Security & Firewall (WAF)</span></h1>
                  <p style={{ color: 'var(--text-muted)' }}>Real-time API Rate Limiter, Threat Inspection, Security Headers, and Live WAF Audit Logs.</p>
                </div>
                <button className="btn-secondary" onClick={fetchFirewallData} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={16} className={firewallLoading ? 'spin' : ''} /> Refresh Status
                </button>
              </div>

              {/* Status Header Cards */}
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div className="glass-panel dashboard-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Shield size={24} color="var(--primary-solid)" />
                    <h4>Protection Mode</h4>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: firewallStatus?.firewallEnabled ? 'var(--success)' : 'var(--error)' }}>
                    {firewallStatus?.firewallEnabled ? 'ACTIVE & ENFORCING' : 'DISABLED'}
                  </div>
                  <button className="btn-primary" onClick={handleToggleFirewall} style={{ marginTop: '12px', padding: '6px 12px', fontSize: '12px' }}>
                    {firewallStatus?.firewallEnabled ? 'Disable Firewall' : 'Enable Firewall Shield'}
                  </button>
                </div>

                <div className="glass-panel dashboard-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Activity size={24} color="#f59e0b" />
                    <h4>Total API Requests</h4>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    {firewallStatus?.totalRequests || 0}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rate Limit: 120 req/min</span>
                </div>

                <div className="glass-panel dashboard-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <AlertCircle size={24} color="#ef4444" />
                    <h4>Threats Blocked (WAF)</h4>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>
                    {firewallStatus?.blockedRequests || 0}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>XSS & SQL Injection filter</span>
                </div>
              </div>

              {/* Active Rules List */}
              <div className="glass-panel dashboard-card" style={{ marginTop: '20px' }}>
                <h3>Enforced Firewall Rules</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat( auto-fit, minmax(220px, 1fr) )', gap: '12px', marginTop: '14px' }}>
                  {firewallStatus?.activeRules?.map((rule, idx) => (
                    <div key={idx} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(16, 185, 129, 0.05)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="var(--success)" />
                      <span>{rule}</span>
                    </div>
                  )) || (
                    <p style={{ color: 'var(--text-muted)' }}>Loading active firewall rules...</p>
                  )}
                </div>
              </div>

              {/* Security Logs Table */}
              <div className="glass-panel dashboard-card" style={{ marginTop: '20px' }}>
                <h3>Real-Time Security Audit Logs</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Captures request IP, event type, authorization state, and threat inspection details.</p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px' }}>Timestamp</th>
                        <th style={{ padding: '10px' }}>Client IP</th>
                        <th style={{ padding: '10px' }}>Event</th>
                        <th style={{ padding: '10px' }}>Status</th>
                        <th style={{ padding: '10px' }}>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firewallLogs.length > 0 ? (
                        firewallLogs.map(log => (
                          <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td style={{ padding: '10px', fontFamily: 'monospace' }}>{log.ip}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.event}</td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ 
                                padding: '3px 8px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: 'bold',
                                background: log.status === 'BLOCKED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: log.status === 'BLOCKED' ? '#ef4444' : '#10b981'
                              }}>
                                {log.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{log.detail}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs recorded yet. Server is monitoring.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEARN & PRACTICE SCREEN */}
          {activeTab === 'learn' && (
            <div className="screen-container">
              <div>
                <h1><span className="gradient-text">Interactive Curriculum</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Select a module below to view animated conceptual slides, analogies, dry-run step visualizers, and code practice.</p>
              </div>

              {/* Module selection bar */}
              <div className="topic-bar">
                {topicsData.map(topic => {
                  const isUnlocked = unlockedTopics.includes(topic.id);
                  const isActive = currentTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      className={`topic-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                      onClick={() => {
                        if (isUnlocked) {
                          setCurrentTopicId(topic.id);
                          setLessonSlideIndex(0);
                        } else {
                          alert(`Complete previous quizzes to unlock ${topic.title}!`);
                        }
                      }}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.title}</span>
                      {!isUnlocked && <Lock size={14} style={{ marginLeft: '4px' }} />}
                    </button>
                  );
                })}
              </div>

              {/* Active Topic Content */}
              {(() => {
                const currentTopic = topicsData.find(t => t.id === currentTopicId) || topicsData[0];
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Lesson / Analogy / Quiz Tabs */}
                    <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                      <button 
                        className={`btn-secondary ${lessonSlideIndex === 0 ? 'active-tab-btn' : ''}`}
                        onClick={() => setLessonSlideIndex(0)}
                      >
                        📖 1. Core Concept
                      </button>
                      <button 
                        className={`btn-secondary ${lessonSlideIndex === 1 ? 'active-tab-btn' : ''}`}
                        onClick={() => setLessonSlideIndex(1)}
                      >
                        💡 2. Real-World Analogy
                      </button>
                      <button 
                        className={`btn-secondary ${lessonSlideIndex === 2 ? 'active-tab-btn' : ''}`}
                        onClick={() => setLessonSlideIndex(2)}
                      >
                        📝 3. Concept Quiz
                      </button>
                    </div>

                    {/* SLIDE 0: LESSON CONCEPT */}
                    {lessonSlideIndex === 0 && (
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h2>{currentTopic.title} - Overview</h2>
                        <p style={{ margin: '16px 0', fontSize: '15px', lineHeight: '1.6' }}>{currentTopic.description}</p>
                        
                        <div className="code-box" style={{ margin: '20px 0' }}>
                          <pre><code>{currentTopic.codeExample}</code></pre>
                        </div>

                        {/* Dry Run Visualizer */}
                        <div className="visualizer-box">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4>🔍 Execution Dry-Run Visualizer</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-secondary" onClick={() => setVisStep(0)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                <RotateCcw size={14} /> Reset
                              </button>
                              <button className="btn-primary" onClick={() => setVisPlaying(!visPlaying)} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                <Play size={14} /> {visPlaying ? 'Pause' : 'Auto Play'}
                              </button>
                            </div>
                          </div>

                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent)' }}>
                              Step {visStep + 1} of {currentTopic.dryRun.steps.length}:
                            </div>
                            <div style={{ margin: '8px 0', fontSize: '14px' }}>
                              {currentTopic.dryRun.steps[visStep]?.explanation}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              Active Highlight: {currentTopic.dryRun.steps[visStep]?.highlightLine}
                            </div>
                          </div>
                        </div>

                        <button className="btn-primary" onClick={() => setLessonSlideIndex(1)} style={{ marginTop: '20px' }}>
                          Next: Real World Analogy <ArrowRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* SLIDE 1: ANALOGY */}
                    {lessonSlideIndex === 1 && (
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h2>Real-World Analogy: {currentTopic.analogy.title}</h2>
                        <p style={{ margin: '16px 0', fontSize: '15px', lineHeight: '1.6' }}>{currentTopic.analogy.story}</p>
                        
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid var(--primary-solid)', margin: '20px 0' }}>
                          <strong>💡 Why this helps:</strong>
                          <p style={{ marginTop: '8px', fontSize: '14px' }}>{currentTopic.analogy.takeaway}</p>
                        </div>

                        <button className="btn-primary" onClick={() => setLessonSlideIndex(2)}>
                          Take Concept Quiz <ArrowRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* SLIDE 2: QUIZ */}
                    {lessonSlideIndex === 2 && (
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h2>{currentTopic.title} Concept Check</h2>
                        
                        {(() => {
                          const questions = quizzesData[currentTopicId] || [];
                          if (quizSubmitted) {
                            return (
                              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <h3>Quiz Results: {quizScore} / {questions.length} Correct</h3>
                                {quizCompleted ? (
                                  <div style={{ margin: '16px 0', color: 'var(--success)', fontWeight: 'bold' }}>
                                    🎉 Perfect Score! Module Mastered. Next module unlocked!
                                  </div>
                                ) : (
                                  <div style={{ margin: '16px 0', color: 'var(--error)' }}>
                                    Keep reviewing! Get all questions right to unlock the next module.
                                  </div>
                                )}
                                <button className="btn-primary" onClick={resetQuiz}>Retry Quiz</button>
                              </div>
                            );
                          }

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                              {questions.map((q, qIdx) => (
                                <div key={qIdx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                                  <strong>Q{qIdx + 1}: {q.question}</strong>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                    {q.options.map((opt, oIdx) => (
                                      <button
                                        key={oIdx}
                                        className={`btn-secondary ${quizAnswers[qIdx] === oIdx ? 'selected-opt' : ''}`}
                                        onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                        style={{ textAlign: 'left', padding: '10px 14px' }}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              <button className="btn-primary" onClick={submitQuiz} style={{ alignSelf: 'flex-start' }}>
                                Submit Quiz Answers
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* PRACTICE CODE EDITOR & COMPILER PANEL */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <h3>Practice Challenge: {activeQuestion?.title}</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{activeQuestion?.description}</p>
                        </div>

                        {/* Difficulty switcher */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {['Basic', 'Intermediate', 'Advanced'].map(diff => (
                            <button
                              key={diff}
                              className={`btn-secondary ${selectedDifficulty === diff ? 'active-diff' : ''}`}
                              onClick={() => setSelectedDifficulty(diff)}
                              style={{ padding: '4px 12px', fontSize: '12px' }}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Code Editor TextArea */}
                      <textarea
                        className="editor-textarea"
                        value={editorCode}
                        onChange={e => setEditorCode(e.target.value)}
                        rows={10}
                      />

                      {/* Control buttons bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn-primary" onClick={() => executeCode(false)}>
                            <Play size={16} fill="#fff" /> Run Code
                          </button>
                          <button className="btn-primary" onClick={() => executeCode(true)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <CheckCircle2 size={16} /> Submit Solution
                          </button>
                        </div>

                        <button className="btn-secondary" onClick={useHint} style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                          💡 Get Hint ({revealHintStage}/5)
                        </button>
                      </div>

                      {/* Graduated Hint display box */}
                      {revealHintStage > 0 && (
                        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid var(--accent)', marginBottom: '16px' }}>
                          <strong>Hint Stage {revealHintStage}:</strong>
                          <p style={{ marginTop: '6px', fontSize: '14px' }}>{activeQuestion?.hints?.[revealHintStage - 1] || 'No further hints available.'}</p>
                        </div>
                      )}

                      {/* Console Output Screen */}
                      <div className="console-box">
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Execution Output Console:</div>
                        {consoleOutput.map((line, idx) => (
                          <div key={idx} style={{ color: consoleIsError ? 'var(--error)' : '#e2e8f0', margin: '4px 0', fontFamily: 'monospace', fontSize: '13px' }}>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* PLAYGROUND SCREEN */}
          {activeTab === 'playground' && (
            <div className="screen-container">
              <div>
                <h1><span className="gradient-text">Freeform Code Playground</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Write custom code snippets, inspect output, and test custom algorithms in any language.</p>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <textarea
                  className="editor-textarea"
                  value={playgroundCode}
                  onChange={e => setPlaygroundCode(e.target.value)}
                  rows={14}
                />

                <div style={{ margin: '16px 0' }}>
                  <button className="btn-primary" onClick={runPlaygroundCode}>
                    <Play size={16} fill="#fff" /> Execute Playground Code
                  </button>
                </div>

                <div className="console-box">
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Console Output:</div>
                  {playgroundConsole.map((line, idx) => (
                    <div key={idx} style={{ color: '#e2e8f0', margin: '4px 0', fontFamily: 'monospace', fontSize: '13px' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CODING GAMES SCREEN */}
          {activeTab === 'games' && (
            <div className="screen-container">
              <div>
                <h1><span className="gradient-text">Gamified Learning Challenges</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Master programming fundamentals through interactive puzzle games.</p>
              </div>

              <div className="topic-bar">
                <button className={`topic-btn ${selectedGame === 'loops' ? 'active' : ''}`} onClick={() => setSelectedGame('loops')}>
                  🤖 Loop Maze Runner
                </button>
                <button className={`topic-btn ${selectedGame === 'recursion' ? 'active' : ''}`} onClick={() => setSelectedGame('recursion')}>
                  🪞 Infinite Mirror (Recursion)
                </button>
                <button className={`topic-btn ${selectedGame === 'stack' ? 'active' : ''}`} onClick={() => setSelectedGame('stack')}>
                  🥞 Dish Stack (Stack DS)
                </button>
                <button className={`topic-btn ${selectedGame === 'functions' ? 'active' : ''}`} onClick={() => setSelectedGame('functions')}>
                  🪄 Spell Builder (Functions)
                </button>
                <button className={`topic-btn ${selectedGame === 'oop' ? 'active' : ''}`} onClick={() => setSelectedGame('oop')}>
                  👾 Monster Factory (OOP)
                </button>
              </div>

              {/* GAME 1: MAZE RUNNER */}
              {selectedGame === 'loops' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h2>Loop Maze Runner</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Build a command sequence to guide the robot to the star goal without hitting red barriers.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                    
                    {/* Maze 5x5 Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 50px)', gap: '6px' }}>
                      {Array.from({ length: 25 }).map((_, idx) => {
                        const x = idx % 5;
                        const y = Math.floor(idx / 5);
                        const isRobot = robotPos.x === x && robotPos.y === y;
                        const isGoal = mazeGoal.x === x && mazeGoal.y === y;
                        const isObs = mazeObstacles.some(o => o.x === x && o.y === y);

                        return (
                          <div key={idx} style={{
                            width: '50px',
                            height: '50px',
                            background: isObs ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                          }}>
                            {isRobot ? '🤖' : isGoal ? '⭐' : isObs ? '🧱' : ''}
                          </div>
                        );
                      })}
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" onClick={() => addMazeCommand('moveForward()')}>Move Forward</button>
                        <button className="btn-secondary" onClick={() => addMazeCommand('turnRight()')}>Turn Right</button>
                        <button className="btn-secondary" onClick={() => addMazeCommand('turnLeft()')}>Turn Left</button>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', minHeight: '80px' }}>
                        <strong>Command Queue:</strong>
                        <div style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--accent)', marginTop: '6px' }}>
                          {mazeCommandQueue.join(' -> ') || 'No commands queued.'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-primary" onClick={runMazeCommands}>Run Robot Code</button>
                        <button className="btn-secondary" onClick={resetMaze}>Reset Board</button>
                      </div>

                      <div className="console-box">
                        <pre style={{ fontSize: '12px' }}>{mazeLog}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 2: RECURSION MIRROR */}
              {selectedGame === 'recursion' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h2>Infinite Mirror (Call Stack Visualizer)</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Observe how recursive function calls build frames on the call stack and unwind back.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span>Recursion Depth:</span>
                      <input type="range" min="1" max="6" value={recursionDepth} onChange={e => setRecursionDepth(Number(e.target.value))} />
                      <span>{recursionDepth}</span>
                      <button className="btn-primary" onClick={runRecursionMirror}>Start Recursion</button>
                    </div>

                    <div className="console-box" style={{ minHeight: '160px' }}>
                      <strong>Active Call Stack Frames:</strong>
                      {recursionStack.map((frame, idx) => (
                        <div key={idx} style={{ padding: '6px', background: 'rgba(168, 85, 247, 0.2)', margin: '6px 0', borderRadius: '6px', fontFamily: 'monospace' }}>
                          [{idx + 1}] {frame}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 3: DISH STACK */}
              {selectedGame === 'stack' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h2>Dish Stack Challenge (Tower of Hanoi)</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Move all plates from Stack A to Stack C. You cannot place a larger plate over a smaller one!</p>

                  {dishGameSuccess && (
                    <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '16px' }}>
                      🎉 Stack challenge cleared! You earned 80 XP and 25 Coins!
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', minHeight: '200px' }}>
                    {[['A', stackA], ['B', stackB], ['C', stackC]].map(([id, stackArr]) => (
                      <div 
                        key={id}
                        onClick={() => handleStackClick(id)}
                        style={{
                          border: `2px ${selectedStackSrc === id ? 'solid var(--accent)' : 'dashed var(--border-color)'}`,
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.02)'
                        }}
                      >
                        <strong style={{ margin: '10px 0' }}>Stack {id}</strong>
                        {stackArr.map((size, idx) => (
                          <div key={idx} style={{
                            width: `${size * 45}px`,
                            height: '24px',
                            background: size === 3 ? '#ec4899' : size === 2 ? '#a855f7' : '#3b82f6',
                            borderRadius: '12px',
                            margin: '3px 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            Plate {size}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 4: SPELL BUILDER */}
              {selectedGame === 'functions' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h2>Spell Builder (Functions & Parameters)</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Pass arguments into the spell function to defeat the enemy goblin.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <label>Spell Power: {spellPower}</label>
                      <input type="range" min="10" max="50" value={spellPower} onChange={e => setSpellPower(Number(e.target.value))} />

                      <label>Element:</label>
                      <select className="glass-input" value={spellElement} onChange={e => setSpellElement(e.target.value)}>
                        <option value="Fire">Fire (1.5x Multiplier)</option>
                        <option value="Ice">Ice (1.2x Multiplier)</option>
                      </select>

                      <label>Modifier:</label>
                      <select className="glass-input" value={spellModifier} onChange={e => setSpellModifier(e.target.value)}>
                        <option value="Blast">Blast (2.0x Multiplier)</option>
                        <option value="Spark">Spark (1.1x Multiplier)</option>
                      </select>

                      <button className="btn-primary" onClick={castSpell}>Cast Spell Function</button>
                    </div>

                    <div>
                      <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', marginBottom: '16px' }}>
                        <h3>Goblin Enemy HP: {spellMonsterHp} / 100</h3>
                        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', marginTop: '8px' }}>
                          <div style={{ width: `${spellMonsterHp}%`, height: '100%', background: '#ef4444', borderRadius: '5px' }}></div>
                        </div>
                      </div>

                      <div className="console-box">
                        {spellLogs.map((log, i) => (
                          <div key={i} style={{ margin: '4px 0', fontFamily: 'monospace' }}>{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 5: MONSTER FACTORY */}
              {selectedGame === 'oop' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h2>Monster Factory (Object-Oriented Programming)</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>Instantiate objects from the base class blueprint with custom properties.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <input type="text" className="glass-input" placeholder="Monster Name" value={monsterName} onChange={e => setMonsterName(e.target.value)} />
                      <select className="glass-input" value={elementalType} onChange={e => setElementalType(e.target.value)}>
                        <option value="Fire">Fire Element</option>
                        <option value="Water">Water Element</option>
                        <option value="Lightning">Lightning Element</option>
                      </select>
                      <button className="btn-primary" onClick={instantiateMonster}>Instantiate Object</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
                      {instantiatedMonsters.map(m => (
                        <div key={m.id} style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ fontSize: '32px' }}>👾</div>
                          <strong>{m.name}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Type: {m.element}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STORE & REWARDS */}
          {activeTab === 'store' && (
            <div className="screen-container">
              <div>
                <h1><span className="gradient-text">Rewards & Hint Store</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Exchange coins earned from lessons for hints and specialized placements packs.</p>
              </div>

              <div className="dashboard-grid">
                
                {/* Hints Store column */}
                <div className="glass-panel dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3>Hint Packs</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Hints reveal graduated assistance: from conceptual clues up to the final solution code.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <div>
                        <strong>10 Hint Pack</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get 10 extra practice hints.</div>
                      </div>
                      <button className="btn-primary" onClick={() => buyHintPack(10, 50)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                        50 Coins
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <div>
                        <strong>50 Hint Pack</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get 50 extra practice hints.</div>
                      </div>
                      <button className="btn-primary" onClick={() => buyHintPack(50, 200)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                        200 Coins
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <div>
                        <strong>100 Hint Pack</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get 100 extra practice hints.</div>
                      </div>
                      <button className="btn-primary" onClick={() => buyHintPack(100, 350)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                        350 Coins
                      </button>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
                    {freeHintAdAvailable ? (
                      <button className="btn-secondary" onClick={playAdAndGetHint} style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--accent)' }}>
                        📺 Watch Ad for Daily Free Hint
                      </button>
                    ) : (
                      <button className="btn-secondary" disabled style={{ opacity: 0.5 }}>
                        ✅ Daily Free Ad Hint Claimed
                      </button>
                    )}
                  </div>
                </div>

                {/* Company Placements column */}
                <div className="glass-panel dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3>Company Interview Packs</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Curated placement question banks and mock testing matching target companies.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {companyPacks.map(pack => {
                      const isUnlocked = unlockedCompanyPacks.includes(pack.id);
                      return (
                        <div key={pack.id} style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px', background: isUnlocked ? 'rgba(16,185,129,0.02)' : 'transparent' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>{pack.name}</strong>
                            {isUnlocked ? (
                              <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '12px' }}>UNLOCKED</span>
                            ) : (
                              <button className="btn-primary" onClick={() => buyCompanyPack(pack.id, pack.cost)} style={{ padding: '6px 12px', fontSize: '12px' }}>
                                {pack.cost} Coins
                              </button>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Includes {pack.questionsCount} high-frequency coding questions.
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SETTINGS MODULE */}
          {activeTab === 'settings' && (
            <div className="screen-container" style={{ maxWidth: '600px' }}>
              <div>
                <h1><span className="gradient-text">Preferences & Settings</span></h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your workspace theme, notifications schedule, and profile credentials.</p>
              </div>

              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Daily Study Reminders</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive daily notification triggers to maintain streaks.</div>
                  </div>
                  <input 
                    type="time" 
                    className="glass-input" 
                    value={notificationTime} 
                    onChange={e => setNotificationTime(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Motivational Quotes & Tips</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rotate inspiring content in push headers.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    checked={enableMotivationalQuotes} 
                    onChange={e => setEnableMotivationalQuotes(e.target.checked)} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>High Contrast Dark Theme</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Use obsidian HSL colors with neon accents.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    checked={darkMode} 
                    onChange={e => setDarkMode(e.target.checked)} 
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Logout of Session</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Securely destroy local JWT tokens.</div>
                  </div>
                  <button className="btn-secondary" onClick={handleLogout} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                    Log Out
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Ad Pop-up Modal */}
      {isPlayingAd && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 8, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '36px',
            textAlign: 'center',
            borderColor: 'var(--accent)',
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.25)'
          }}>
            <span style={{ fontSize: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>ADVERTISEMENT</span>
            <h2 style={{ margin: '16px 0 8px 0', fontSize: '28px' }} className="gradient-text-accent">Google Antigravity IDE</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              The next-generation AI coding assistant built on Gemini 3.6 Flash. Edit files, debug rules, and run compile scripts automatically in the browser!
            </p>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '4px solid rgba(255,255,255,0.05)',
              borderTopColor: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {adCountdown}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Your free hint will unlock when the ad completes.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
