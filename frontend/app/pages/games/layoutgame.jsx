import React, { useRef, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { rem } from "../../../components/stylings/responsiveSize";
import logo from "../../../assets/images/vera.png";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const LayoutGame = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const copyToClipboard = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const activities = [
    {
      id: 1,
      title: "1 min Breathing",
      image: "https://img.freepik.com/free-vector/woman-doing-yoga-park_1308-122857.jpg?semt=ais_hybrid",
      navigateTo: "TakeABreath",
      color: "#8b5cf6",
      icon: "leaf-outline",
    },
    {
      id: 2,
      title: "Mood Track",
      image: "https://media.istockphoto.com/id/1304715728/vector/emotions-scale-on-smartphone-screen-mood-concept-tiny-girl-leave-feedback-online-emoji-set.jpg?s=612x612&w=0&k=20&c=aL0usVoe-3cOGY_Opru5f_NJnsLpZLZqqiuqMVkPbK8=",
      navigateTo: "MoodTrackerScreen",
      color: "#06b6d4",
      icon: "happy-outline",
    },
    {
      id: 3,
      title: "FlipCard Game",
      image: require("../../../assets/images/flipcard.jpg"),
      navigateTo: "ClipCardGame",
      color: "#f59e0b",
      icon: "layers-outline",
    },
    {
      id: 4,
      title: "Catch It!",
      image: "https://img.freepik.com/premium-photo/cute-cat-hold-full-love-basket_1298798-2327.jpg",
      navigateTo: "Fallinggame",
      color: "#ec4899",
      icon: "game-controller-outline",
    },
    {
      id: 5,
      title: "Diary Jar",
      image: "https://thumbs.dreamstime.com/b/glass-jar-filled-strips-paper-each-one-containing-handwritten-message-buried-beneath-tree-waiting-to-be-unearthed-322199911.jpg",
      navigateTo: "Diary",
      color: "#10b981",
      icon: "book-outline",
    },
  ];

  const wellnessTips = [
    {
      id: 1,
      title: "😊 Calm Down Tips",
      tips: [
        "Tense and relax muscles from toes to head.",
        "Rub an ice cube on your skin.",
        "Carry essential oil, a stress ball, or mint gum.",
      ],
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      id: 2,
      title: "🧘‍♂️ Mindfulness Tips",
      tips: [
        "Focus on your breathing for a few minutes.",
        "Practice gratitude by listing three things you're thankful for.",
        "Take a short walk and observe your surroundings mindfully.",
      ],
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
    },
  ];

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image source={logo} style={styles.logo} />
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              onPress={() => navigation.navigate("Settings")}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image
            source={{
              uri: "https://mindfulnessexercises.com/wp-content/uploads/2019/11/Visualizing-Your-Peaceful-and-Beautiful-Place-BG.jpg",
            }}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <View style={styles.quoteContainer}>
            <BoldText style={styles.quote}>
              "I know this won't be easy, but I also know you've got what it takes to get through it."
            </BoldText>
          </View>
        </Animated.View>

        {/* Activities Grid */}
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
              <Ionicons name="game-controller" size={24} color="#8b5cf6" />
              <BoldText style={styles.sectionTitle}>Wellness Activities</BoldText>
            </View>
            <Text style={styles.sectionSubtitle}>
              Choose an activity to boost your mood
            </Text>
          </View>

          <View style={styles.activitiesGrid}>
            {activities.map((activity, index) => (
              <AnimatedTouchable
                key={activity.id}
                style={[
                  styles.activityCard,
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
                onPress={() => navigation.navigate(activity.navigateTo)}
                activeOpacity={0.8}
              >
                <View style={styles.activityImageContainer}>
                  <Image
                    source={typeof activity.image === 'string' ? { uri: activity.image } : activity.image}
                    style={styles.activityImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.activityOverlay}
                  />
                  <View style={[styles.activityIcon, { backgroundColor: activity.bgColor }]}>
                    <Ionicons name={activity.icon} size={20} color={activity.color} />
                  </View>
                </View>
                <Text style={[styles.activityText, { color: activity.color }]}>
                  {activity.title}
                </Text>
              </AnimatedTouchable>
            ))}
          </View>
        </Animated.View>

        {/* Report Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("WeeklyWellnessReport")}
            style={styles.reportCard}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: "https://cdn.prod.website-files.com/59e16042ec229e00016d3a66/613158262dde4943a51937aa_data%20visualization%20tips_blog%20hero.webp",
              }}
              style={styles.reportImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(139, 92, 246, 0.9)']}
              style={styles.reportOverlay}
            />
            <View style={styles.reportContent}>
              <View style={styles.reportIcon}>
                <Ionicons name="stats-chart" size={24} color="white" />
              </View>
              <View style={styles.reportTextContainer}>
                <BoldText style={styles.reportTitle}>Weekly Wellness Report</BoldText>
                <Text style={styles.reportSubtitle}>
                  Track your progress and insights
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Wellness Tips */}
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
              <Ionicons name="bulb-outline" size={24} color="#8b5cf6" />
              <BoldText style={styles.sectionTitle}>Wellness Tips</BoldText>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {wellnessTips.map((tip, index) => (
              <Animated.View
                key={tip.id}
                style={[
                  styles.tipCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { 
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 30],
                          outputRange: [0, 10 * index]
                        }) 
                      }
                    ]
                  }
                ]}
              >
                <View style={[styles.tipHeader, { backgroundColor: tip.bgColor }]}>
                  <BoldText style={[styles.tipTitle, { color: tip.color }]}>
                    {tip.title}
                  </BoldText>
                </View>
                <View style={styles.tipContent}>
                  {tip.tips.map((tipText, tipIndex) => (
                    <View key={tipIndex} style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>{tipText}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Emergency Contact */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="call" size={24} color="#ef4444" />
              <BoldText style={styles.emergencyTitle}>Mental Health Support</BoldText>
            </View>
            <Text style={styles.emergencySubtitle}>
              If you need urgent support, please reach out to:
            </Text>
            
            <View style={styles.hotlineContainer}>
              <TouchableOpacity 
                style={styles.hotlineButton}
                onPress={() => copyToClipboard("1553")}
                activeOpacity={0.7}
              >
                <View style={styles.hotlineIcon}>
                  <Ionicons name="flag" size={16} color="#ef4444" />
                </View>
                <View style={styles.hotlineTextContainer}>
                  <Text style={styles.hotlineLabel}>National Crisis Hotline</Text>
                  <Text style={styles.hotlineNumber}>1553</Text>
                </View>
                <Ionicons name="call-outline" size={20} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.hotlineButton}
                onPress={() => copyToClipboard("09178998727")}
                activeOpacity={0.7}
              >
                <View style={styles.hotlineIcon}>
                  <Ionicons name="location" size={16} color="#ef4444" />
                </View>
                <View style={styles.hotlineTextContainer}>
                  <Text style={styles.hotlineLabel}>Local Support</Text>
                  <Text style={styles.hotlineNumber}>0917-899-8727</Text>
                </View>
                <Ionicons name="call-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
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
  logo: {
    width: 120,
    height: 50,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  },
  heroSection: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 160,
    borderRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  quoteContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  quote: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#1f2937",
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  activityCard: {
    width: (width - 64) / 3,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityImageContainer: {
    position: "relative",
    width: "100%",
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  activityImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  activityOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  activityIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  reportCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  reportImage: {
    width: "100%",
    height: 120,
  },
  reportOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  reportContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  reportTextContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  tipsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tipHeader: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  tipContent: {
    padding: 16,
    paddingTop: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  tipBullet: {
    color: "#6b7280",
    fontSize: 16,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  emergencyCard: {
    marginHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    color: "#1f2937",
  },
  emergencySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  hotlineContainer: {
    gap: 12,
  },
  hotlineButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
    gap: 12,
  },
  hotlineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  hotlineTextContainer: {
    flex: 1,
  },
  hotlineLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  hotlineNumber: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default LayoutGame;