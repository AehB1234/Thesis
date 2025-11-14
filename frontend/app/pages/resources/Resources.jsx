import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Chip, PaperProvider, Searchbar } from "react-native-paper";
import theme from "../../../components/CustomTheme";
import { useNavigation } from "@react-navigation/native";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";

const { width } = Dimensions.get("window");

const Resources = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  const resources = [
    {
      id: 1,
      category: "Family",
      title: "Take Care of Your Mind",
      description: "Essential mental health tips for families to build stronger bonds and emotional resilience",
      image:
        "https://lafayettefamilyymca.org/wp-content/uploads/2022/01/155210504_m.jpg",
      navigateTo: "MentalHealth",
      color: "#10b981",
      duration: "5 min read",
      rating: "4.8",
    },
    {
      id: 2,
      category: "Health",
      title: "Healthy Mind, Healthy Life",
      description: "Build better mental wellness habits through daily practices and mindfulness techniques",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6PUWWn6900b4PQZjIhmWcOi8HpfhnxLBiw&s",
      navigateTo: "Slider2",
      color: "#3b82f6",
      duration: "7 min read",
      rating: "4.9",
    },
    {
      id: 3,
      category: "Professional",
      title: "PATHFINDER Guide",
      description: "Professional guidance and counseling resources for workplace mental health",
      image:
        "https://media.istockphoto.com/id/1383880527/vector/psychologist-counseling-a-sad-african-young-woman.jpg?s=612x612&w=0&k=20&c=d4j_RyvvfxrB3B4L0rOgF747htnfTxBD-PDLF0agopI=",
      navigateTo: "Slider3",
      color: "#8b5cf6",
      duration: "10 min read",
      rating: "4.7",
    },
    {
      id: 4,
      category: "Academic",
      title: "Education Saves Lives",
      description: "Breaking the silence around mental health in educational settings",
      image:
        "https://img.freepik.com/premium-photo/globe-world-education-logo-children-save-school-taking-care-hands-books-kids-icon_1029469-88679.jpg",
      navigateTo: "Slider4",
      color: "#f59e0b",
      duration: "6 min read",
      rating: "4.8",
    },
    {
      id: 5,
      category: "Health",
      title: "Mindful Meditation",
      description: "Learn meditation techniques to reduce stress and improve focus",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      navigateTo: "Slider5",
      color: "#3b82f6",
      duration: "8 min read",
      rating: "4.9",
    },
    {
      id: 6,
      category: "Family",
      title: "Parenting with Empathy",
      description: "Building emotional intelligence in children through mindful parenting",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      navigateTo: "Slider6",
      color: "#10b981",
      duration: "12 min read",
      rating: "4.6",
    },
  ];

  const categories = [
    { name: "All", icon: "apps", color: "#6b7280", count: resources.length },
    { name: "Health", icon: "heart", color: "#3b82f6", count: resources.filter(r => r.category === "Health").length },
    { name: "Academic", icon: "book", color: "#f59e0b", count: resources.filter(r => r.category === "Academic").length },
    { name: "Family", icon: "people", color: "#10b981", count: resources.filter(r => r.category === "Family").length },
    { name: "Professional", icon: "briefcase", color: "#8b5cf6", count: resources.filter(r => r.category === "Professional").length },
  ];

  // Filter Resources based on selected category and search
  const filteredResources = resources.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardPressIn = (id) => {
    setActiveCard(id);
  };

  const handleCardPressOut = () => {
    setActiveCard(null);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.headerSection}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Octicons name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <BoldText style={styles.header}>Resources</BoldText>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Octicons name="bookmark" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              Discover mental health resources and expert guides
            </Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Searchbar
                placeholder="Search resources, guides, tips..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#8b5cf6"
                inputStyle={styles.searchInput}
                elevation={2}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </LinearGradient>

          {/* Category Chips */}
          <View style={styles.categorySection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      selectedCategory === category.name 
                        ? [category.color, category.color]
                        : ['#fff', '#fff']
                    }
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.name && styles.categoryChipSelected,
                    ]}
                  >
                    <View style={styles.categoryIconContainer}>
                      <Octicons
                        name={category.icon}
                        size={16}
                        color={selectedCategory === category.name ? "white" : category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category.name && styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                    <View style={[
                      styles.categoryCount,
                      selectedCategory === category.name && styles.categoryCountSelected
                    ]}>
                      <Text style={[
                        styles.categoryCountText,
                        selectedCategory === category.name && styles.categoryCountTextSelected
                      ]}>
                        {category.count}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Results Count */}
          <View style={styles.resultsCount}>
            <Text style={styles.resultsText}>
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
            </Text>
            <TouchableOpacity style={styles.filterButton}>
              <Octicons name="filter" size={16} color="#6b7280" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Resource Cards */}
          <View style={styles.cardContainer}>
            {filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.card,
                    activeCard === item.id && styles.cardActive
                  ]}
                  onPress={() => navigation.navigate(item.navigateTo)}
                  onPressIn={() => handleCardPressIn(item.id)}
                  onPressOut={handleCardPressOut}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardImageContainer}>
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.cardImage} 
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.cardGradient}
                    />
                    
                    {/* Badge with Icon */}
                    <View style={[styles.cardBadge, { backgroundColor: item.color }]}>
                      <Octicons 
                        name={categories.find(cat => cat.name === item.category)?.icon || "circle"} 
                        size={12} 
                        color="#fff" 
                      />
                      <Text style={styles.cardBadgeText}>{item.category}</Text>
                    </View>

                    {/* Rating and Duration */}
                    <View style={styles.cardMeta}>
                      <View style={styles.metaItem}>
                        <Octicons name="star-fill" size={12} color="#FFD700" />
                        <Text style={styles.metaText}>{item.rating}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Octicons name="clock" size={12} color="#fff" />
                        <Text style={styles.metaText}>{item.duration}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <BoldText style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </BoldText>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    
                    <View style={styles.cardFooter}>
                      <View style={styles.readMoreContainer}>
                        <Text style={styles.readMore}>Explore Guide</Text>
                        <Octicons name="arrow-right" size={16} color="#8b5cf6" />
                      </View>
                      <TouchableOpacity style={styles.saveButton}>
                        <Octicons name="bookmark" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIllustration}>
                  <Octicons name="search" size={64} color="#d1d5db" />
                </View>
                <BoldText style={styles.emptyTitle}>No resources found</BoldText>
                <Text style={styles.emptyText}>
                  Try adjusting your search terms or browse different categories
                </Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default Resources;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    fontFamily: "Primary",
    fontSize: 16,
  },
  categorySection: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    gap: 8,
    minHeight: 44,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryChipSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  categoryCount: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  categoryCountSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  categoryCountText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  categoryCountTextSelected: {
    color: "white",
  },
  resultsCount: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    transform: [{ scale: 1 }],
  },
  cardActive: {
    transform: [{ scale: 0.98 }],
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  cardBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
  cardMeta: {
    position: "absolute",
    bottom: 16,
    left: 16,
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readMore: {
    fontSize: 15,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  saveButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 24,
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});