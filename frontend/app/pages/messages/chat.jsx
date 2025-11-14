import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Text
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Appbar, DefaultTheme, PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import { rem } from "../../../components/stylings/responsiveSize";
import { default as CustomText } from "../../../components/CustomText";
import MessageBox from "../../../components/MessageBox";
import theme from "../../../components/CustomTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";

const Chat = ({ navigation }) => {
  const { axiosInstanceWithBearer, user } = useAuth();
  const stackRouter = useRoute();
  const { isNew, chatId } = stackRouter.params;
  const [id, setId] = useState(chatId ? chatId : null);

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const [chats, setChats] = useState([]);
  
  // Conversation Summarization State
  const [conversationSummary, setConversationSummary] = useState({
    emotionalState: "neutral",
    riskLevel: "low", // low, medium, high, crisis
    primaryConcerns: [],
    copingStrategiesUsed: [],
    moodTrend: "stable", // improving, declining, stable, fluctuating
    lastUpdated: null,
    keyInsights: []
  });

  const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HF_TOKEN;
  const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

  // Enhanced crisis resources with more details
  const CRISIS_RESOURCES = [
    "🆘 National Mental Health Crisis Hotline: 1553 (24/7, free call)",
    "💬 Natasha Goulbourn Foundation Hopeline: (02) 8804-4673",
    "🚑 Emergency Services: 911",
    "🏥 National Center for Mental Health Crisis Hotline: 0917-899-8727",
    "🌐 In Touch Community Services Crisis Line: (02) 8893-7603",
    "👥 Philippine Mental Health Association: (02) 8921-4958",
    "💙 Mind You Mental Health: 0917-709-3556",
    "🤝 Manila Lifeline Centre: (02) 896-9191",
    "🏛️ DOH Mental Health Program: 1553",
    "📞 Globe Telecom's GCash Helpline: 2882"
  ];

  // Quick coping techniques for immediate relief
  const QUICK_COPING_TECHNIQUES = [
    {
      name: "5-4-3-2-1 Grounding",
      steps: "Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste"
    },
    {
      name: "Box Breathing",
      steps: "Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat 4 times."
    },
    {
      name: "Temperature Change",
      steps: "Hold an ice cube or splash cold water on your face to reset your nervous system"
    },
    {
      name: "Progressive Muscle Relaxation",
      steps: "Tense and then release each muscle group from your toes to your head"
    }
  ];

  // Conversation Summarization Functions
  const analyzeEmotionalState = (message) => {
    const text = message.toLowerCase();
    let emotionalScore = {
      anxiety: 0,
      depression: 0,
      anger: 0,
      loneliness: 0,
      stress: 0,
      crisis: 0
    };

    // Anxiety indicators
    if (/(anxious|anxiety|worried|panic|overwhelmed|nervous|scared|fear)/.test(text)) {
      emotionalScore.anxiety += 2;
      if (/(panic|overwhelmed)/.test(text)) emotionalScore.anxiety += 1;
    }

    // Depression indicators
    if (/(sad|depressed|hopeless|empty|numb|down|blue|tired|exhausted|can't sleep)/.test(text)) {
      emotionalScore.depression += 2;
      if (/(hopeless|empty|numb)/.test(text)) emotionalScore.depression += 1;
    }

    // Anger indicators
    if (/(angry|frustrated|irritated|mad|rage|annoyed|pissed)/.test(text)) {
      emotionalScore.anger += 2;
    }

    // Loneliness indicators
    if (/(lonely|alone|isolated|no one understands|empty|abandoned)/.test(text)) {
      emotionalScore.loneliness += 2;
    }

    // Stress indicators
    if (/(stress|stressed|pressure|burnout|overwhelmed|can't cope)/.test(text)) {
      emotionalScore.stress += 2;
    }

    // Crisis indicators
    if (/(suicide|kill myself|end it all|want to die|harm myself|not worth living|better off dead)/.test(text)) {
      emotionalScore.crisis += 5;
    }

    return emotionalScore;
  };

  const determineRiskLevel = (emotionalScore) => {
    const totalScore = Object.values(emotionalScore).reduce((a, b) => a + b, 0);
    
    if (emotionalScore.crisis >= 5) return "crisis";
    if (totalScore >= 8 || emotionalScore.anxiety >= 4 || emotionalScore.depression >= 4) return "high";
    if (totalScore >= 4) return "medium";
    return "low";
  };

  const extractPrimaryConcerns = (message, currentConcerns = []) => {
    const text = message.toLowerCase();
    const concerns = [...currentConcerns];
    const concernMap = {
      anxiety: /(anxious|anxiety|worried|panic|nervous|scared|fear)/,
      depression: /(sad|depressed|hopeless|empty|numb|down|blue)/,
      anger: /(angry|frustrated|irritated|mad|rage)/,
      loneliness: /(lonely|alone|isolated|no one understands)/,
      stress: /(stress|stressed|pressure|burnout|overwhelmed)/,
      sleep: /(can't sleep|insomnia|tired but can't sleep)/,
      relationships: /(friend|family|partner|boyfriend|girlfriend|husband|wife)/,
      work: /(work|job|career|boss|colleague|office)/,
      school: /(school|college|university|exam|test|study)/
    };

    Object.entries(concernMap).forEach(([concern, pattern]) => {
      if (pattern.test(text) && !concerns.includes(concern)) {
        concerns.push(concern);
      }
    });

    // Keep only last 5 concerns to maintain relevance
    return concerns.slice(-5);
  };

  const trackCopingStrategies = (message, currentStrategies = []) => {
    const text = message.toLowerCase();
    const strategies = [...currentStrategies];
    
    const strategyMap = {
      breathing: /(breathe|breathing|calm breath|box breathing|4-7-8)/,
      grounding: /(grounding|5-4-3-2-1|present moment|here and now)/,
      mindfulness: /(mindful|meditation|present|observe|notice)/,
      relaxation: /(relax|muscle relaxation|calm|peace)/,
      selfcare: /(self.?care|rest|break|pause|slow down)/
    };

    Object.entries(strategyMap).forEach(([strategy, pattern]) => {
      if (pattern.test(text) && !strategies.includes(strategy)) {
        strategies.push(strategy);
      }
    });

    return strategies.slice(-5);
  };

  const updateConversationSummary = (userMessage, botResponse = null) => {
    setConversationSummary(prev => {
      const emotionalScore = analyzeEmotionalState(userMessage);
      const riskLevel = determineRiskLevel(emotionalScore);
      const primaryConcerns = extractPrimaryConcerns(userMessage, prev.primaryConcerns);
      const copingStrategies = botResponse ? trackCopingStrategies(botResponse, prev.copingStrategiesUsed) : prev.copingStrategiesUsed;

      // Determine emotional state based on highest score
      const mainEmotion = Object.entries(emotionalScore).reduce((a, b) => 
        emotionalScore[a] > emotionalScore[b] ? a : b
      );

      // Determine mood trend
      let moodTrend = prev.moodTrend;
      const currentIntensity = Object.values(emotionalScore).reduce((a, b) => a + b, 0);
      const prevIntensity = prev.lastUpdated ? 
        Object.values(analyzeEmotionalState(prev.lastUpdated.message || '')).reduce((a, b) => a + b, 0) : 0;
      
      if (currentIntensity > prevIntensity + 2) moodTrend = "declining";
      else if (currentIntensity < prevIntensity - 2) moodTrend = "improving";
      else if (Math.abs(currentIntensity - prevIntensity) <= 2) moodTrend = "stable";
      else moodTrend = "fluctuating";

      // Generate key insights
      const keyInsights = generateKeyInsights(primaryConcerns, riskLevel, moodTrend);

      return {
        emotionalState: mainEmotion,
        riskLevel,
        primaryConcerns,
        copingStrategiesUsed: copingStrategies,
        moodTrend,
        lastUpdated: {
          message: userMessage,
          timestamp: new Date().toISOString(),
          emotionalScore
        },
        keyInsights
      };
    });
  };

  const generateKeyInsights = (concerns, riskLevel, moodTrend) => {
    const insights = [];
    
    if (riskLevel === "crisis" || riskLevel === "high") {
      insights.push("User is experiencing significant distress and may need immediate support");
    }
    
    if (concerns.includes("anxiety") && concerns.includes("sleep")) {
      insights.push("Anxiety appears to be affecting sleep patterns");
    }
    
    if (concerns.includes("depression") && concerns.includes("loneliness")) {
      insights.push("Social connection may help alleviate depressive symptoms");
    }
    
    if (moodTrend === "declining") {
      insights.push("Emotional state appears to be worsening - increased support may be needed");
    }
    
    if (moodTrend === "improving") {
      insights.push("Positive trend observed - current coping strategies may be effective");
    }

    return insights.slice(0, 3); // Limit to 3 most relevant insights
  };

  const showConversationSummary = () => {
    const riskLevelColors = {
      low: "#4CAF50",
      medium: "#FF9800",
      high: "#F44336",
      crisis: "#D32F2F"
    };

    const emotionLabels = {
      anxiety: "Anxiety",
      depression: "Depression",
      anger: "Anger",
      loneliness: "Loneliness",
      stress: "Stress",
      crisis: "Crisis",
      neutral: "Neutral"
    };

    Alert.alert(
      "Conversation Insights 💭",
      `Emotional State: ${emotionLabels[conversationSummary.emotionalState] || conversationSummary.emotionalState}\n` +
      `Risk Level: ${conversationSummary.riskLevel.toUpperCase()}\n` +
      `Mood Trend: ${conversationSummary.moodTrend}\n\n` +
      `Primary Concerns: ${conversationSummary.primaryConcerns.join(", ") || "None identified"}\n\n` +
      `Coping Strategies Discussed: ${conversationSummary.copingStrategiesUsed.join(", ") || "None yet"}\n\n` +
      `Key Insights:\n${conversationSummary.keyInsights.map(insight => `• ${insight}`).join("\n") || "No specific insights yet"}`,
      [
        { 
          text: "View Crisis Resources", 
          onPress: showCrisisResources,
          style: conversationSummary.riskLevel === "crisis" ? "destructive" : "default"
        },
        { 
          text: "Share Summary", 
          onPress: () => shareSummaryWithProfessional()
        },
        { 
          text: "Close", 
          style: "cancel" 
        }
      ]
    );
  };

  const shareSummaryWithProfessional = () => {
    // This would typically integrate with your backend to share with professionals
    Alert.alert(
      "Share Insights",
      "This feature would allow you to share these insights with a mental health professional. Would you like to learn more about connecting with professional support?",
      [
        {
          text: "Yes, Connect Me",
          onPress: () => {
            setMessage("I'd like to connect with a mental health professional");
            setTimeout(() => handleMessage(), 500);
          }
        },
        {
          text: "Not Now",
          style: "cancel"
        }
      ]
    );
  };

  const scrollToBottom = () => {
    chatRef.current?.scrollToEnd({ animated: true });
  };

  // Enhanced mental health focused responses with coping strategies
  const getMentalHealthFallback = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Crisis and urgent needs - with immediate coping strategies
    if (/(suicide|kill myself|end it all|want to die|harm myself|not worth living)/.test(message)) {
      showCrisisResources();
      const technique = QUICK_COPING_TECHNIQUES[Math.floor(Math.random() * QUICK_COPING_TECHNIQUES.length)];
      return `I hear the immense pain in your words, and I want you to know your life matters deeply. Please hold on and try this right now: "${technique.steps}". This can help ground you while we connect you with immediate support. I've shared crisis resources above - would you be willing to reach out? I'm here with you every step of the way.`;
    }
    
    if (/(help|emergency|crisis|urgent|can't cope|overwhelmed)/.test(message)) {
      showCrisisResources();
      return `It sounds like you're feeling completely overwhelmed right now. Let's try something together: Take 3 deep breaths with me. Breathe in slowly... hold... and breathe out. When you're ready, try the 5-4-3-2-1 grounding technique: look around and name 5 things you can see. I'm here with you, and there are people ready to support you immediately.`;
    }

    // Emotional states with coping strategies
    if (/(sad|depressed|hopeless|empty|numb|down|blue)/.test(message)) {
      const strategies = [
        `I hear the heaviness in what you're sharing. Depression can make everything feel overwhelming. Try this: Set a tiny goal for today - just one small thing like drinking a glass of water or stepping outside for 2 minutes. Small steps matter.`,
        `The weight of depression is real. You're showing strength by reaching out. Try "behavioral activation" - do one small activity you used to enjoy, even for 5 minutes. It can help create small shifts.`,
        `I'm hearing the deep ache of sadness. Let's try a gentle self-compassion break: Place your hand on your heart and say "This is a moment of suffering. May I be kind to myself."`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    if (/(anxious|anxiety|worried|panic|overwhelmed|nervous)/.test(message)) {
      const strategies = [
        `Anxiety can feel like a storm inside. Let's try "box breathing" together: Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 4 times. I'm breathing with you.`,
        `That worry sounds overwhelming. Try the "5-4-3-2-1" grounding technique: Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, 1 thing you taste.`,
        `I hear the racing thoughts. Try "thought labeling": Notice your thoughts like clouds passing by, and gently label them "worrying" or "planning" without judgment.`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    if (/(angry|frustrated|irritated|mad|rage|annoyed)/.test(message)) {
      const strategies = [
        `Anger often shows up when something important feels threatened. Try the "STOP" technique: Stop, Take a breath, Observe your feelings, Proceed with intention.`,
        `That frustration sounds intense. Try "temperature change" - hold an ice cube or splash cold water on your face to calm your nervous system.`,
        `I hear the sharp edge of anger. Try "urge surfing" - notice the anger like a wave that builds, peaks, and passes without acting on it.`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    if (/(lonely|alone|isolated|no one understands|empty)/.test(message)) {
      const strategies = [
        `Loneliness can feel like such an empty space. Try reaching out with a small connection today - even a brief text to someone, or joining an online community about something you enjoy.`,
        `That sense of isolation sounds painful. Try writing a letter to your future self about what you're going through - it can be comforting to express these feelings.`,
        `I'm hearing the deep ache of loneliness. Try the "self-compassion break": "This is lonely. Other people feel this way too. May I be kind to myself right now."`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    if (/(stress|stressed|pressure|burnout|tired|exhausted)/.test(message)) {
      const strategies = [
        `Stress can be overwhelming. Try the "two-minute reset": Set a timer for 2 minutes and do nothing but breathe. No tasks, no thinking - just being.`,
        `I hear the exhaustion in your words. Try the "Pomodoro technique": Work for 25 minutes, then take a 5-minute break. Even small breaks can help reset your system.`,
        `That sounds really draining. Try "progressive muscle relaxation": Tense and release each muscle group from toes to head, noticing the difference between tension and relaxation.`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // Sleep issues
    if (/(can't sleep|insomnia|tired but can't sleep|exhausted but awake)/.test(message)) {
      const strategies = [
        `Sleep struggles are so difficult. Try the "4-7-8 breathing technique": Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times. This can activate your relaxation response.`,
        `I hear how exhausting sleep problems can be. Try getting out of bed if you can't sleep after 20 minutes, and do something calming in dim light until you feel sleepy.`,
        `Sleep issues can really impact everything. Try creating a "worry time" earlier in the day to write down concerns, so your mind can rest at night.`
      ];
      return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // Default therapeutic responses with coping tips
    const therapeuticResponses = [
      `I hear you. Thank you for sharing that with me. Would you like to try a quick grounding exercise together? Look around and name three safe things you can see.`,
      `That sounds really meaningful. I'm listening carefully. Sometimes writing about these feelings can help process them - would you like to explore that?`,
      `Thank you for trusting me with this. I notice the courage it takes to share these thoughts. Let's take one gentle breath together before we continue.`,
      `I'm sitting with what you've shared. This feels important. Remember that feelings are like waves - they come and go. You can surf this wave.`,
      `I hear the significance in what you're describing. Your experience matters. Try placing a hand on your heart - this simple gesture can be surprisingly comforting.`,
      `Thank you for bringing this here. I'm wondering what small act of self-care might feel supportive right now? Even something tiny counts.`,
      `I'm listening with care to what you're sharing. Sometimes naming the emotion out loud - "I feel [emotion]" - can create a little space from it.`,
      `That sounds like it holds a lot of meaning for you. I'm here to help you explore. Would you like to try a brief mindfulness exercise together?`
    ];
    
    return therapeuticResponses[Math.floor(Math.random() * therapeuticResponses.length)];
  };

  // Enhanced crisis resources with coping strategies
  const showCrisisResources = () => {
    const quickTechnique = QUICK_COPING_TECHNIQUES[Math.floor(Math.random() * QUICK_COPING_TECHNIQUES.length)];
    
    Alert.alert(
      "💝 Immediate Support Is Available",
      `First, try this quick coping technique: "${quickTechnique.steps}"\n\nYou don't have to face this alone. Compassionate professionals are available 24/7:\n\n` + 
      CRISIS_RESOURCES.join('\n') +
      "\n\nYour safety and wellbeing matter most. Please reach out - you deserve support.",
      [
        { 
          text: "Try Another Coping Technique", 
          onPress: () => {
            const anotherTechnique = QUICK_COPING_TECHNIQUES[Math.floor(Math.random() * QUICK_COPING_TECHNIQUES.length)];
            Alert.alert(
              "Quick Coping Technique",
              `${anotherTechnique.name}: ${anotherTechnique.steps}`,
              [{ text: "Thank you", style: "default" }]
            );
          }
        },
        { 
          text: "I Need More Support", 
          onPress: () => {
            Alert.alert(
              "Additional Support",
              "Would you like me to help you practice reaching out, or explore more coping strategies?",
              [
                {
                  text: "Practice reaching out",
                  onPress: () => {
                    setMessage("Can you help me practice what to say when I call for help?");
                    setTimeout(() => handleMessage(), 500);
                  }
                },
                {
                  text: "More coping strategies",
                  onPress: () => {
                    setMessage("I need more coping strategies for crisis moments");
                    setTimeout(() => handleMessage(), 500);
                  }
                },
                {
                  text: "Breathing exercise",
                  onPress: () => {
                    setMessage("Can you guide me through a breathing exercise?");
                    setTimeout(() => handleMessage(), 500);
                  }
                },
                {
                  text: "Not right now",
                  style: "cancel"
                }
              ]
            );
          }
        },
        { 
          text: "I'll Reach Out", 
          style: "default" 
        }
      ]
    );
  };

  // Enhanced prompt for mental health with coping focus
  const createMentalHealthPrompt = (userMessage, chatHistory = []) => {
    const systemPrompt = `You are a compassionate mental health supporter. Provide warm, validating responses that include practical coping strategies, grounding techniques, or mindfulness exercises. Focus on immediate, actionable tips that can help in the moment. Be supportive, caring, and offer concrete suggestions.`;

    const history = chatHistory
      .slice(-4)
      .map(chat => `${chat.user ? "User" : "Assistant"}: ${chat.text}`)
      .join("\n");

    return history ? `${systemPrompt}\n\n${history}\nUser: ${userMessage}\nAssistant:` : `${systemPrompt}\nUser: ${userMessage}\nAssistant:`;
  };

  const callMentalHealthAPI = async (userMessage, chatHistory = []) => {
    try {
      const prompt = createMentalHealthPrompt(userMessage, chatHistory);

      const response = await fetch(HUGGING_FACE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.8,
            do_sample: true,
            return_full_text: false
          },
          options: {
            wait_for_model: false,
          }
        }),
      });

      if (!response.ok) {
        return getMentalHealthFallback(userMessage);
      }

      const data = await response.json();
      
      if (data && data[0] && data[0].generated_text) {
        let cleanedResponse = data[0].generated_text.trim();
        
        cleanedResponse = cleanedResponse
          .replace(/Assistant:\s*/g, '')
          .replace(/Response:\s*/g, '')
          .replace(/"/g, '')
          .trim();
        
        if (cleanedResponse.length > 10) {
          return cleanedResponse;
        } else {
          return getMentalHealthFallback(userMessage);
        }
      } else {
        return getMentalHealthFallback(userMessage);
      }
    } catch (error) {
      console.error('Error calling mental health API:', error);
      return getMentalHealthFallback(userMessage);
    }
  };

  const handleMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    // Enhanced crisis keyword detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'harm myself',
      'not worth living', 'better off dead', 'can\'t take it anymore'
    ];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    if (hasCrisisKeyword) {
      setTimeout(() => showCrisisResources(), 300);
    }

    // Add user message to chat immediately
    const newUserMessage = { user: true, text: userMessage };
    setChats(prev => [...prev, newUserMessage]);

    try {
      let currentChatId = id;

      if (!currentChatId || isNew) {
        const chatRes = await axiosInstanceWithBearer.post(`/Chat`, {
          title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : ''),
          preview: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
          type: 'mental_health',
        });
        currentChatId = chatRes.data._id || chatRes.data.id;
        setId(currentChatId);
      }

      await axiosInstanceWithBearer.post(`/Message`, {
        chat: currentChatId,
        from_user: true,
        message_content: userMessage,
      });

      const botResponse = await callMentalHealthAPI(userMessage, chats);

      const botMessage = { user: false, text: botResponse };
      setChats(prev => [...prev, botMessage]);

      // Update conversation summary with both user message and bot response
      updateConversationSummary(userMessage, botResponse);

      await axiosInstanceWithBearer.post(`/Message`, {
        chat: currentChatId,
        from_user: false,
        message_content: botResponse,
      });

    } catch (error) {
      console.error('Error in handleMessage:', error);
      
      const fallbackResponse = getMentalHealthFallback(userMessage);
      const errorMessage = { 
        user: false, 
        text: fallbackResponse
      };
      setChats(prev => [...prev, errorMessage]);
      
      // Update summary even with fallback response
      updateConversationSummary(userMessage, fallbackResponse);
      
      if (id) {
        try {
          await axiosInstanceWithBearer.post(`/Message`, {
            chat: id,
            from_user: false,
            message_content: errorMessage.text,
          });
        } catch (e) {
          console.log('Failed to save error message:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    Alert.alert(
      "💜 Taking Care of You",
      "Before you go, here's a quick coping technique you can use anytime: Take 3 deep breaths and name one thing you're grateful for in this moment.",
      [
        { 
          text: "View Conversation Insights", 
          onPress: showConversationSummary
        },
        { 
          text: "Back to Chat History", 
          onPress: () => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              router.push('/chats');
            }
          },
          style: "default"
        },
        { 
          text: "Crisis Resources", 
          onPress: showCrisisResources,
          style: "destructive"
        },
        { 
          text: "Quick Coping Tip", 
          onPress: () => {
            const technique = QUICK_COPING_TECHNIQUES[Math.floor(Math.random() * QUICK_COPING_TECHNIQUES.length)];
            Alert.alert(
              "Quick Coping Technique",
              `${technique.name}: ${technique.steps}`,
              [{ text: "Thank you", style: "default" }]
            );
          }
        },
        { 
          text: "Stay in Chat", 
          onPress: () => {
            console.log("User chose to stay in chat");
          },
          style: "cancel"
        }
      ]
    );
  };

  // Simple back action without alert - for quick navigation
  const handleSimpleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (chatId && !isNew) {
      retrieveMessages();
    }
  }, [chatId, isNew]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const retrieveMessages = async () => {
    try {
      console.log("searching: ", chatId);
      const res = await axiosInstanceWithBearer.get(
        `/Message?chat_id=${chatId}`
      );
      console.log(res.data);
      
      const retrievedChats = res.data.map(item => ({
        user: item.from_user,
        text: item.message_content
      }));
      
      setChats(retrievedChats);
      
      // Analyze existing conversation for summary
      if (retrievedChats.length > 0) {
        const userMessages = retrievedChats.filter(chat => chat.user).map(chat => chat.text);
        userMessages.forEach(message => {
          updateConversationSummary(message);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#e3f2fd" />
        <Appbar.Header 
          theme={DefaultTheme}
          style={{ 
            elevation: 2, 
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            backgroundColor: '#e3f2fd',
          }}
        >
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content 
            title={
              <CustomText style={{ 
                fontSize: rem(18),
                color: '#1976d2',
                fontWeight: '600'
              }}>
                Mental Health Support
              </CustomText>
            } 
          />
          <Appbar.Action 
            icon="chart-box" 
            onPress={showConversationSummary}
            color="#1976d2"
          />
          <Appbar.Action 
            icon="lifebuoy" 
            onPress={showCrisisResources}
            color="#1976d2"
          />
          {/* Quick back button for chat history */}
          <Appbar.Action 
            icon="format-list-bulleted" 
            onPress={handleSimpleBack}
            color="#1976d2"
          />
        </Appbar.Header>
        
        {/* Enhanced Crisis Resources Banner with Risk Indicator */}
        <View style={{
          backgroundColor: conversationSummary.riskLevel === 'crisis' ? '#ffebee' : 
                          conversationSummary.riskLevel === 'high' ? '#fff3e0' : '#fff3cd',
          padding: rem(8),
          borderBottomWidth: 1,
          borderBottomColor: conversationSummary.riskLevel === 'crisis' ? '#ffcdd2' : 
                            conversationSummary.riskLevel === 'high' ? '#ffe0b2' : '#ffeaa7',
        }}>
          <CustomText style={{
            fontSize: rem(12),
            textAlign: 'center',
            color: conversationSummary.riskLevel === 'crisis' ? '#c62828' : 
                   conversationSummary.riskLevel === 'high' ? '#ef6c00' : '#856404',
            fontFamily: "Seco",
          }}>
            {conversationSummary.riskLevel === 'crisis' ? '🚨 High Support Needed - Please reach out' :
             conversationSummary.riskLevel === 'high' ? '⚠️ Increased Support Available' :
             '💛 You are not alone. Tap the chart for insights or lifebuoy for immediate support.'}
          </CustomText>
        </View>
        
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
            <ScrollView 
              ref={chatRef} 
              contentContainerStyle={{ 
                flexGrow: 1,
                paddingHorizontal: rem(16),
                paddingVertical: rem(8),
              }}
              showsVerticalScrollIndicator={false}
            >
              {chats.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                    padding: rem(20),
                  }}
                >
                  <View style={{
                    backgroundColor: 'white',
                    padding: rem(20),
                    borderRadius: rem(16),
                    alignItems: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}>
                    <Ionicons 
                      name="heart-outline" 
                      size={rem(32)} 
                      color="#1976d2" 
                      style={{ marginBottom: rem(12) }}
                    />
                    <CustomText style={{ 
                      fontFamily: "Seco", 
                      fontSize: rem(16),
                      textAlign: "center",
                      color: "#1976d2",
                      marginBottom: rem(8),
                    }}>
                      Welcome to Your Safe Space 💝
                    </CustomText>
                    <CustomText style={{ 
                      fontSize: rem(14),
                      textAlign: "center",
                      color: "#666",
                      lineHeight: rem(20),
                      marginBottom: rem(12),
                    }}>
                      This is a judgment-free zone where your feelings are always valid. 
                      Share what's on your heart, and we'll navigate it together with compassion and practical coping strategies.
                    </CustomText>
                    <CustomText style={{ 
                      fontSize: rem(12),
                      textAlign: "center",
                      color: "#1976d2",
                      fontStyle: 'italic',
                    }}>
                      Try: "I'm feeling anxious" or "I need coping strategies for stress"
                    </CustomText>
                  </View>
                </View>
              ) : (
                <View style={{ gap: rem(12) }}>
                  {chats.map((item, i) => (
                    <MessageBox 
                      key={i} 
                      text={item.text} 
                      user={item.user}
                      isMentalHealth={true}
                    />
                  ))}
                  {isLoading && (
                    <View style={{ 
                      alignSelf: 'flex-start',
                      backgroundColor: '#e3f2fd',
                      padding: rem(12),
                      borderRadius: rem(16),
                      borderTopLeftRadius: rem(4),
                      marginRight: rem(60),
                    }}>
                      <ActivityIndicator size="small" color="#1976d2" />
                      <CustomText style={{
                        fontSize: rem(12),
                        color: '#1976d2',
                        marginTop: rem(4),
                        fontStyle: 'italic',
                      }}>
                        Thinking of supportive strategies for you...
                      </CustomText>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Enhanced Input Container */}
            <View
              style={{
                backgroundColor: "white",
                paddingHorizontal: rem(16),
                paddingVertical: rem(12),
                borderTopWidth: 1,
                borderTopColor: "#e0e0e0",
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: rem(8),
                }}
              >
                <TextInput
                  style={{ 
                    flex: 1,
                    paddingHorizontal: rem(16),
                    paddingVertical: Platform.OS === 'ios' ? rem(12) : rem(8),
                    borderWidth: 1, 
                    borderColor: "#bbdefb",
                    borderRadius: 24,
                    fontSize: rem(14),
                    backgroundColor: "#f3f9ff",
                    maxHeight: rem(100),
                  }}
                  placeholder="Share what's on your heart or ask for coping tips..."
                  placeholderTextColor="#90a4ae"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  returnKeyType="send"
                  onSubmitEditing={handleMessage}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={handleMessage}
                  disabled={!message.trim() || isLoading}
                  style={{
                    padding: rem(10),
                    backgroundColor: (message.trim() && !isLoading) ? "#1976d2" : "#bbdefb",
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons
                      name="heart"
                      size={rem(18)}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <CustomText style={{
                fontSize: rem(11),
                color: '#90a4ae',
                textAlign: 'center',
                marginTop: rem(8),
              }}>
                💜 Try: "coping tips for anxiety" or "I need grounding techniques"
              </CustomText>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Chat;