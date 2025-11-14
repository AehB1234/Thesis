import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef } from "react";
import background from "../../../assets/images/bg/abstract2.png";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/images/vera.png";

//Sizing
import { rem } from "../../../components/stylings/responsiveSize";

//Customs
import CustomTheme from "../../../components/CustomTheme";

//Paper
import {
  ActivityIndicator,
  Button,
  PaperProvider,
  Dialog,
  Portal,
} from "react-native-paper";

//Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

import { useAuth } from "../../../context/AuthContext";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");
const TILE_WIDTH = width * 0.38;
const TILE_SPACING = 12;

const Home = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const { user } = useAuth();
  const authState = useSelector((state) => state.auth.auth);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const headerSlide = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    // Staggered animations for better visual flow
    Animated.sequence([
      // Header animation
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Main content animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse animation for main CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const hideDialog = () => setVisible(false);

  // Enhanced resources data with better images and descriptions
  const resources = [
    {
      id: 1,
      category: "Family Support",
      title: "Mental Wellness Guide",
      image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd61b?w=400",
      navigateTo: "MentalHealth",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      icon: "heart-outline",
    },
    {
      id: 2,
      category: "Health & Wellness",
      title: "Healthy Lifestyle Tips",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
      navigateTo: "Slider2",
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
      icon: "fitness-outline",
    },
    {
      id: 3,
      category: "Career Guidance",
      title: "Professional Development",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
      navigateTo: "Slider3",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      icon: "briefcase-outline",
    },
    {
      id: 4,
      category: "Education",
      title: "Learning Resources",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
      navigateTo: "Slider4",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      icon: "school-outline",
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: "AI Chat",
      emoji: "💬",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      navigateTo: "ChatBot",
      icon: "chatbubble-ellipses-outline",
    },
    {
      id: 2,
      title: "Breathe",
      emoji: "🧘",
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
      navigateTo: "BreathingExercise",
      icon: "leaf-outline",
    },
    {
      id: 3,
      title: "Journal",
      emoji: "📔",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      navigateTo: "Diary",
      icon: "book-outline",
    },
    {
      id: 4,
      title: "Mood",
      emoji: "😊",
      color: "#ec4899",
      bgColor: "rgba(236, 72, 153, 0.1)",
      navigateTo: "MoodTrackerScreen",
      icon: "happy-outline",
    },
  ];

  const stats = [
    {
      id: 1,
      value: "7+",
      label: "Therapy Tools",
      icon: "⚡",
      color: "#8b5cf6",
    },
    {
      id: 2,
      value: "24/7",
      label: "AI Support",
      icon: "🤖",
      color: "#06b6d4",
    },
    {
      id: 3,
      value: "100%",
      label: "Private",
      icon: "🔒",
      color: "#10b981",
    },
  ];

  const handleCardPress = (navigateTo) => {
    if (authState.isLoggedIn) {
      navigation.navigate(navigateTo);
    } else {
      setVisible(true);
    }
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <PaperProvider theme={CustomTheme}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      {!(user.username === "") ? (
        <View style={styles.container}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Header */}
            <Animated.View 
              style={[
                styles.header,
                {
                  transform: [{ translateY: headerSlide }]
                }
              ]}
            >
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
                <View style={styles.userBadge}>
                  <Ionicons name="sparkles" size={16} color="#8b5cf6" />
                  <Text style={styles.userBadgeText}>Welcome!</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={styles.settingsButton}
                >
                  <Ionicons name="notifications-outline" size={22} color="#6b7280" />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={styles.settingsButton}
                >
                  <Ionicons name="settings-outline" size={22} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Welcome Section */}
            <Animated.View 
              style={[
                styles.welcomeSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.greeting}>Hello there,</Text>
                <Text style={styles.username}>
                  {user?.first_name || user?.username || 'Friend'}! 👋
                </Text>
                <Text style={styles.subtitle}>
                  Ready to explore your emotional wellness journey today?
                </Text>
              </View>
            </Animated.View>

            {/* Stats Section */}
            <Animated.View 
              style={[
                styles.statsSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {stats.map((stat, index) => (
                <View key={stat.id} style={styles.statCard}>
                  <Text style={[styles.statIcon, { color: stat.color }]}>
                    {stat.icon}
                  </Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Main Feature Card */}
            <Animated.View 
              style={[
                styles.mainCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <Image source={background} style={styles.cardBackground} />
              <LinearGradient
                colors={["rgba(139, 92, 246, 0.95)", "rgba(124, 58, 237, 0.85)"]}
                style={styles.cardOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Animated.View 
                      style={[
                        styles.microphoneIcon,
                        { transform: [{ scale: pulseAnim }] }
                      ]}
                    >
                      <MaterialCommunityIcons name="brain" size={36} color="white" />
                    </Animated.View>
                  </View>
                  <BoldText style={styles.cardTitle}>
                    Emotional Insights
                  </BoldText>
                  <Text style={styles.cardSubtitle}>
                    Discover patterns in your emotions with our AI-powered analysis
                  </Text>
                  <AnimatedTouchable
                    style={[
                      styles.primaryButton,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                    onPress={() => handleCardPress("Conditions")}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#ffffff", "#f8fafc"]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Feather name="play" size={20} color="#8b5cf6" />
                      <Text style={styles.buttonText}>Begin Analysis</Text>
                      <Ionicons name="arrow-forward" size={16} color="#8b5cf6" />
                    </LinearGradient>
                  </AnimatedTouchable>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Quick Actions Section */}
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="flash-outline" size={24} color="#8b5cf6" />
                  <BoldText style={styles.sectionTitle}>Quick Actions</BoldText>
                </View>
                <TouchableOpacity style={styles.seeMoreButton}>
                  <Text style={styles.seeMore}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
                </TouchableOpacity>
              </View>

              <View style={styles.quickActions}>
                {quickActions.map((action, index) => (
                  <AnimatedTouchable
                    key={action.id}
                    style={[
                      styles.actionCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          { 
                            translateY: slideAnim.interpolate({
                              inputRange: [0, 30],
                              outputRange: [0, 15 * index]
                            }) 
                          }
                        ]
                      }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(action.navigateTo)}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
                      <Ionicons name={action.icon} size={24} color={action.color} />
                    </View>
                    <Text style={[styles.actionText, { color: action.color }]}>
                      {action.title}
                    </Text>
                  </AnimatedTouchable>
                ))}
              </View>
            </Animated.View>

            {/* Resources Section */}
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="library-outline" size={24} color="#8b5cf6" />
                  <BoldText style={styles.sectionTitle}>Resources</BoldText>
                </View>
                <TouchableOpacity 
                  style={styles.seeMoreButton}
                  onPress={() => navigation.navigate("Resources")}
                >
                  <Text style={styles.seeMore}>Explore</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={styles.resourcesScroll}
                decelerationRate="fast"
                snapToInterval={TILE_WIDTH + TILE_SPACING}
                snapToAlignment="start"
              >
                {resources.map((resource, index) => (
                  <AnimatedTouchable
                    key={resource.id}
                    style={[
                      styles.resourceCard,
                      {
                        opacity: fadeAnim,
                        transform: [
                          { 
                            translateX: slideAnim.interpolate({
                              inputRange: [0, 30],
                              outputRange: [0, 20 * index]
                            }) 
                          }
                        ]
                      }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(resource.navigateTo)}
                  >
                    <Image
                      source={{ uri: resource.image }}
                      style={styles.resourceImage}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.resourceGradient}
                    />
                    <View style={styles.resourceContent}>
                      <View style={[styles.categoryBadge, { backgroundColor: resource.bgColor }]}>
                        <Ionicons name={resource.icon} size={12} color={resource.color} />
                        <Text style={[styles.categoryText, { color: resource.color }]}>
                          {resource.category}
                        </Text>
                      </View>
                      <Text style={styles.resourceTitle} numberOfLines={2}>
                        {resource.title}
                      </Text>
                      <View style={styles.resourceArrow}>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                      </View>
                    </View>
                  </AnimatedTouchable>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Daily Tip */}
            <Animated.View 
              style={[
                styles.tipSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <Ionicons name="bulb-outline" size={24} color="#8b5cf6" />
                </View>
                <View style={styles.tipContent}>
                  <BoldText style={styles.tipTitle}>Daily Wellness Tip</BoldText>
                  <Text style={styles.tipText}>
                    Take 5 deep breaths when feeling overwhelmed. It helps reset your nervous system.
                  </Text>
                </View>
              </View>
            </Animated.View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Loading your wellness space...</Text>
        </View>
      )}

      <Portal>
        <Dialog
          style={styles.dialog}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Welcome! 🌟</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Please log in to access personalized emotional analysis and track your wellness journey.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#6b7280">
              Later
            </Button>
            <Button onPress={() => navigation.navigate("Login")} textColor="#8b5cf6">
              Sign In
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  userBadgeText: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  welcomeSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  welcomeTextContainer: {
    maxWidth: "80%",
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  username: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#1f2937",
    fontWeight: "700",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeMore: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  mainCard: {
    marginHorizontal: 24,
    marginBottom: 28,
    borderRadius: 24,
    height: 280,
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  cardBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  cardContent: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  microphoneIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 30,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: "#8b5cf6",
    fontSize: 16,
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  resourcesScroll: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  resourceCard: {
    width: TILE_WIDTH,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resourceImage: {
    width: "100%",
    height: TILE_WIDTH * 1.2,
    resizeMode: "cover",
  },
  resourceGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  resourceContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    lineHeight: 18,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resourceArrow: {
    alignSelf: "flex-end",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tipIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
  },
  dialogTitle: {
    textAlign: "center",
    color: "#1f2937",
  },
  dialogText: {
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 20,
  },
});

export default Home;