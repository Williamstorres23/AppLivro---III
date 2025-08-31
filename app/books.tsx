import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const defaultBooks = [
  {
    id: '1',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genero: 'Clássicos de Ficção',
    publicacao: 1899,
    paginas: 208,
    cover: require('../assets/images/dom_casmurro.jpg'),
    summary: 'Dom Casmurro, de Machado de Assis, retrata Bento Santiago relembrando sua juventude e o romance com Capitu. Dominado pelo ciúme, ele questiona a fidelidade dela. A narrativa é ambígua e subjetiva, deixando dúvidas ao leitor. Capitu, com seus "olhos de ressaca", representa o mistério do enredo. O livro propõe um mergulho psicológico no narrador.'
  },
  {
    id: '2',
    title: 'Antes que o Café Esfrie: 1',
    author: 'Toshikazu Kawaguchi',
    genero: 'Ficção Científica',
    publicacao: 2022,
    paginas: 208,
    cover: require('../assets/images/antes-que-o-cafe-esfrie.jpg'),
    summary: 'Antes que o Café Esfrie, de Toshikazu Kawaguchi, se passa em uma cafeteria em Tóquio onde é possível viajar no tempo. Quatro personagens enfrentam dilemas pessoais e voltam ao passado em busca de compreensão e reconciliação. A viagem tem regras rígidas, como retornar antes que o café esfrie. A narrativa mistura fantasia com reflexões sobre arrependimento, perdão e aceitação. O livro convida o leitor a valorizar o presente e as pequenas oportunidades da vida.'
  },
  {
    id: '3',
    title: 'Crime e Castigo',
    author: 'Fiódor Dostoiévski',
    genero: 'Literatura e Ficção',
    publicacao: 2016,
    paginas: 592,
    cover: require('../assets/images/crime-e-castigo.jpg'),
    summary: 'Crime e Castigo, de Fiódor Dostoiévski, acompanha Raskólnikov, um jovem ex-estudante que comete um assassinato acreditando estar acima da moral comum. Após o crime, ele mergulha em um tormento psicológico e existencial. A narrativa explora culpa, redenção e os limites da justiça. Sonia, uma jovem humilde, torna-se símbolo de compaixão e fé. O romance é um mergulho profundo na mente humana e nos dilemas éticos da sociedade.'
  },
  {
    id: '4',
    title: 'Grande Sertão: Veredas',
    author: 'João Guimarães Rosa',
    genero: 'Literatura Nacional',
    publicacao: 2019,
    paginas: 560,
    cover: require('../assets/images/grande_sertao.jpg'),
    summary: 'Grande Sertão: Veredas, de João Guimarães Rosa, narra a vida de Riobaldo, ex-jagunço que relembra suas aventuras pelo sertão e seu amor por Diadorim. A obra mistura ação, filosofia e dilemas existenciais, com linguagem inovadora e regionalista. Riobaldo questiona o bem, o mal e até faz um pacto com o diabo. Diadorim, revelada como mulher no fim, simboliza o amor impossível. O livro é um mergulho profundo na alma sertaneja e humana.'
  },
  {
    id: '5',
    title: 'Nada Pode Me Ferir',
    author: 'David Goggins',
    genero: 'Autobiografia',
    publicacao: 2023,
    paginas: 320,
    cover: require('../assets/images/nada-pode-me-ferir.jpg'),
    summary: 'Nada Pode Me Ferir, de David Goggins, é uma autobiografia inspiradora sobre superação extrema. O autor narra sua jornada desde uma infância marcada por abusos e racismo até se tornar um dos homens mais resilientes do mundo. Ele defende que a mente desiste antes do corpo e apresenta métodos para ultrapassar limites físicos e mentais. A obra propõe disciplina brutal, enfrentamento da dor e autoconhecimento como ferramentas de transformação. É um verdadeiro manual para quem quer destruir desculpas e alcançar o impossível.'
  },
  {
    id: '6',
    title: 'O Alquimista',
    author: 'Paulo Coelho',
    genero: 'Ficção Religiosa, Literatura e Ficção',
    publicacao: 2017,
    paginas: 208,
    cover: require('../assets/images/o_alquimista.jpg'),
    summary: 'O Alquimista, de Paulo Coelho, conta a jornada de Santiago, um jovem pastor que parte da Espanha rumo ao Egito em busca de um tesouro revelado em sonhos. Ao longo do caminho, ele encontra personagens como Melquisedeque, Fátima e o Alquimista, que o ajudam a entender sua “Lenda Pessoal”. A narrativa mistura espiritualidade, autoconhecimento e sinais do universo. Santiago descobre que o verdadeiro tesouro está na jornada e na transformação interior.'
  },
  {
    id: '7',
    title: 'Outlive: A Arte e a Ciência de Viver Mais e Melhor',
    author: 'Peter Attia' + 'Bill Gifford',
    genero: 'Ciência e Saúde',
    publicacao: 2023,
    paginas: 480,
    cover: require('../assets/images/outlive.jpg'),
    summary: 'Outlive: A Arte e a Ciência de Viver Mais e Melhor, de Peter Attia e Bill Gifford, é um guia sobre longevidade com foco na prevenção de doenças crônicas. O autor propõe a “Medicina 3.0”, que prioriza ações personalizadas para evitar os “Quatro Cavaleiros” do envelhecimento: doenças cardíacas, câncer, diabetes tipo 2 e neurodegenerativas. O livro destaca pilares como exercício físico, nutrição, sono e saúde emocional, oferecendo estratégias práticas para melhorar a qualidade e o tempo de vida. Attia também apresenta o conceito do “Decatlo do Centenário”, incentivando hábitos que permitam envelhecer com autonomia.'
  },
  {
    id: '8',
    title: 'Pedagogia do Oprimido',
    author: 'Paulo Freire',
    genero: 'Política de Educação e Reforma',
    publicacao: 2019,
    paginas: 256,
    cover: require('../assets/images/pedagogia-do-oprimido.jpg'),
    summary: 'Pedagogia do Oprimido, de Paulo Freire, propõe uma educação libertadora voltada à conscientização dos oprimidos. O autor critica o modelo “bancário” de ensino, em que o aluno é passivo, e defende o diálogo como ferramenta de transformação. A obra valoriza a práxis — união entre ação e reflexão — como caminho para a liberdade. Freire acredita que ninguém liberta ninguém sozinho: a libertação ocorre em comunhão. É um marco na luta por justiça social e educação crítica.'
  },
  {
    id: '9',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genero: 'Fantasia, Ação e Aventura',
    publicacao: 2018,
    paginas: 96,
    cover: require('../assets/images/pequeno-principe.jpg'),
    summary: 'O Pequeno Príncipe, de Antoine de Saint-Exupéry, narra o encontro entre um piloto e um menino vindo do asteroide B-612. Em sua jornada, o príncipe conhece figuras que representam falhas humanas, como vaidade e ganância. A amizade com a raposa ensina que “o essencial é invisível aos olhos”. A história valoriza o amor, a infância e os laços afetivos. É uma fábula poética sobre o que realmente importa na vida.'
  },
  {
    id: '10',
    title: 'Tudo é Rio',
    author: 'Carla Madeira',
    genero: 'Ficção de Gênero',
    publicacao: 2021,
    paginas: 210,
    cover: require('../assets/images/tudo-e-rio.jpg'),
    summary: 'Tudo é Rio, de Carla Madeira, acompanha Dalva e Venâncio, um casal marcado por uma tragédia causada pelo ciúme doentio dele. A chegada de Lucy, uma prostituta sedutora, forma um triângulo amoroso intenso e doloroso. A narrativa flui como um rio, explorando temas como amor, culpa, perdão e redenção. Com linguagem poética e visceral, o livro mergulha nas profundezas das emoções humanas.'
  },
  {
    id: '11',
    title: 'Verity',
    author: 'Colleen Hoover',
    genero: 'Suspense',
    publicacao: 2020,
    paginas: 320,
    cover: require('../assets/images/verity.jpg'),
    summary: 'Verity, de Colleen Hoover, é um thriller psicológico intenso e perturbador. Lowen, uma escritora em crise, é contratada para terminar os livros de Verity Crawford, autora famosa em estado vegetativo. Ao se mudar para a casa da família, Lowen encontra um manuscrito chocante que revela segredos sombrios sobre Verity e sua relação com os filhos. A tensão cresce com a dúvida: o manuscrito é verdade ou ficção? O final deixa o leitor dividido entre duas versões inquietantes da história.'
  }
]

export default function BooksPage() {
  const [books, setBooks] = useState(defaultBooks);

  // --- Estados novos ---
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  // --- Carregar livros ---
  useFocusEffect(
    useCallback(() => {
      const loadBooks = async () => {
        try {
          const stored = await AsyncStorage.getItem('customBooks');
          const parsed = stored ? JSON.parse(stored) : [];
          setBooks([...defaultBooks, ...parsed]);
        } catch (e) {
          console.error('Erro ao carregar livros:', e);
        }
      };

      loadBooks();
    }, [])
  );

  // --- Navegar para detalhes ---
  function handlePress(book: any) {
    router.push({
      pathname: '/bookDetails',
      params: {
        title: book.title,
        author: book.author,
        publicacao: book.publicacao.toString(),
        summary: book.summary,
        genero: book.genero,
        paginas: book.paginas,
      },
    });
  }

  // --- Favoritar ---
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // --- Avaliar ---
  const handleRating = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  // --- Comentários ---
  const addComment = (id: string) => {
    if (!newComment[id]) return;
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment[id]],
    }));
    setNewComment((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Livros</Text>

      {/* Busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar livro..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={books.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row' }}
            >
              <Image source={item.cover} style={styles.cover} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>por {item.author}</Text>
                <Text style={styles.publicacao}>
                  Publicado em {item.publicacao}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Favoritar */}
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Text style={styles.favorite}>
                {favorites.includes(item.id) ? '⭐ Favorito' : '☆ Favoritar'}
              </Text>
            </TouchableOpacity>

            {/* Avaliação */}
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRating(item.id, star)}
                >
                  <Text style={styles.star}>
                    {ratings[item.id] >= star ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Comentários */}
            <TextInput
              placeholder="Escreva um comentário..."
              value={newComment[item.id] || ''}
              onChangeText={(text) =>
                setNewComment((prev) => ({ ...prev, [item.id]: text }))
              }
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={() => addComment(item.id)}>
              <Text style={styles.commentButton}>Adicionar comentário</Text>
            </TouchableOpacity>

            {comments[item.id]?.map((c, idx) => (
              <Text key={idx} style={styles.comment}>
                • {c}
              </Text>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/addBook')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 18,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    width: windowWidth - 32,
  },
  cover: {
    width: 100,
    height: 140,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 4,
  },
  author: {
    fontSize: 15,
    color: '#5d5d5d',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  publicacao: {
    fontSize: 13,
    color: '#888',
  },
  favorite: {
    fontSize: 16,
    marginTop: 8,
    color: '#e65100',
  },
  stars: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  star: {
    fontSize: 20,
    marginHorizontal: 2,
    color: '#ff9800',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  commentButton: {
    color: '#1a237e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comment: {
    fontStyle: 'italic',
    fontSize: 13,
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1a237e',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});