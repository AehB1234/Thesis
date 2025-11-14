import { useState, useRef } from "react";
import { 
  View, 
  Image, 
  TouchableOpacity, 
  PanResponder, 
  Animated,
  Dimensions,
  StyleSheet 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';

const { width, height } = Dimensions.get("window");

const images = [
  require("../../../assets/images/resources/Healthy mind, healthy life/1.png"),
  require("../../../assets/images/resources/Healthy mind, healthy life/2.png"),
  require("../../../assets/images/resources/Healthy mind, healthy life/3.png"),
  require("../../../assets/images/resources/Healthy mind, healthy life/4.png"),
];

const contentData = [
  {
    title: "Healthy Mind, Healthy Life",
    description: "Your mental wellness is the foundation for a fulfilling life. Start building better habits today.",
    tip: "Daily meditation can reduce stress by 30%"
  },
  {
    title: "Mindful Moments",
    description: "Take time to pause and breathe. Small moments of mindfulness throughout the day make a big difference.",
    tip: "Try the 4-7-8 breathing technique"
  },
  {
    title: "Positive Habits",
    description: "Build routines that support your mental health. Consistency is key to long-term wellness.",
    tip: "Exercise releases endorphins - natural mood boosters"
  },
  {
    title: "Your Wellness Journey",
    description: "You've taken important steps toward better mental health. Continue practicing these habits daily.",
    tip: "Share your progress with supportive friends"
  }
];

export default function Slider2() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = (direction) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change index
      if (direction === 'next') {
        setIndex(prev => prev + 1);
      } else {
        setIndex(prev => prev - 1);
      }
      // Reset slide animation
      slideAnim.setValue(direction === 'next' ? -50 : 50);
      
      // Fade in with slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const nextImage = () => {
    if (index < images.length - 1) {
      animateTransition('next');
    } else {
      handleComplete();
    }
  };

  const prevImage = () => {
    if (index > 0) {
      animateTransition('prev');
    }
  };

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack();
    });
  };

  // Enhanced Swipe Gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          prevImage(); // Swipe Right
        } else if (gestureState.dx < -100) {
          nextImage(); // Swipe Left
        }
      },
    })
  ).current;

  const ProgressDots = () => (
    <View style={styles.progressContainer}>
      {images.map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressDot,
            i === index && styles.progressDotActive,
            i < index && styles.progressDotCompleted,
          ]}
        >
          {i < index && (
            <Octicons name="check" size={12} color="#fff" />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slideContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {/* Background Image */}
        <Image
          source={images[index]}
          style={styles.backgroundImage}
        />
        
        {/* Overlay Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Progress Dots */}
          <ProgressDots />

          {/* Text Content */}
          <View style={styles.textContainer}>
            <BoldText style={styles.title}>
              {contentData[index].title}
            </BoldText>
            <Text style={styles.description}>
              {contentData[index].description}
            </Text>
            
            {/* Tip Box */}
            <View style={styles.tipContainer}>
              <Octicons name="light-bulb" size={20} color="#FFD700" />
              <Text style={styles.tipText}>
                {contentData[index].tip}
              </Text>
            </View>
          </View>

          {/* Navigation Controls */}
          <View style={styles.controlsContainer}>
            {/* Back Button */}
            {index > 0 && (
              <TouchableOpacity
                onPress={prevImage}
                style={styles.navButton}
              >
                <Octicons name="chevron-left" size={28} color="#fff" />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {/* Next/Complete Button */}
            <TouchableOpacity
              onPress={nextImage}
              style={[
                styles.mainButton,
                index === images.length - 1 && styles.completeButton
              ]}
            >
              <Text style={styles.mainButtonText}>
                {index === images.length - 1 ? 'Complete' : 'Next'}
              </Text>
              {index < images.length - 1 && (
                <Octicons name="chevron-right" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Skip Button */}
        {index < images.length - 1 && (
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8E6C9',
  },
  slideContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  progressDotActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  progressDotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    maxWidth: '90%',
  },
  tipText: {
    fontSize: 14,
    color: '#FFD700',
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    opacity: 0.8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  completeButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    padding: 12,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
});