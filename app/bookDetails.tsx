import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookDetails() {
  const { title, author, publicacao, summary, genero, paginas } = useLocalSearchParams();

  // ⭐ estado para avaliação
  const [rating, setRating] = useState(0);

  // 📖 estado para marcar como lido
  const [isRead, setIsRead] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>por {author}</Text>
      <Text style={styles.genero}>Gênero: {genero}</Text>
      <Text style={styles.publicacao}>Publicado em {publicacao}</Text>
      <Text style={styles.pagina}>Nº de páginas: {paginas}</Text>

      <Text style={styles.summaryTitle}>Resumo:</Text>
      <Text style={styles.summary}>{summary}</Text>

      {/* ⭐ Avaliação */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, { color: star <= rating ? '#FFD700' : '#999' }]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>Sua avaliação: {rating} estrelas</Text>

      {/* 📖 Botão para marcar como lido */}
      <TouchableOpacity
        style={[styles.readButton, { backgroundColor: isRead ? 'green' : '#0d47a1' }]}
        onPress={() => setIsRead(!isRead)}
      >
        <Text style={styles.readButtonText}>
          {isRead ? '✔ Livro Lido' : 'Marcar como Lido'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#0d47a1',
    marginBottom: 6,
  },
  genero: {
    fontSize: 16,
    color: '#0d47a1',
    marginBottom: 6,
  },
  publicacao: {
    fontSize: 14,
    color: '#0d47a1',
    marginBottom: 4,
  },
  pagina: {
    fontSize: 14,
    color: '#0d47a1',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 8,
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
    color: '#0d47a1',
    textAlign: 'left',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  star: {
    fontSize: 28,
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#0d47a1',
    marginBottom: 16,
  },
  readButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  readButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
