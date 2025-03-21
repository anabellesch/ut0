async function searchBooksByTitle(title) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return null;
  }
}

async function getBookDetails(olid) {
  try {
    const response = await fetch(`https://openlibrary.org/works/${olid}.json`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener detalles del libro:', error);
    return null;
  }
}






async function main() {
    
    const searchResults = await searchBooksByTitle('Don Quijote');
    
    if (searchResults && searchResults.docs.length > 0) {
      console.log(`Se encontraron ${searchResults.numFound} resultados.`);
      
      
      const topResults = searchResults.docs.slice(0, 5);
      
      console.log('\nResultados principales:');
      topResults.forEach((book, index) => {
        console.log(`${index + 1}. "${book.title}" por ${book.author_name ? book.author_name.join(', ') : 'Autor desconocido'}`);
        console.log(`   Año de publicación: ${book.first_publish_year || 'Desconocido'}`);
        console.log(`   ID de Open Library: ${book.key.split('/').pop()}`);
        console.log('-----------------------');
      });

      if (topResults[0] && topResults[0].key) {
        const olid = topResults[0].key.split('/').pop();
        const bookDetails = await getBookDetails(olid);
        
        if (bookDetails) {
          console.log('\nDetalles del primer libro:');
          console.log(`Título: ${bookDetails.title}`);
          console.log(`Descripción: ${bookDetails.description ? 
            (typeof bookDetails.description === 'string' ? 
              bookDetails.description : 
              bookDetails.description.value || 'No disponible') : 
            'No disponible'}`);
          console.log(`Última actualización: ${new Date(bookDetails.last_modified.value).toLocaleDateString()}`);
        }
      }
    } else {
      console.log('No se encontraron resultados o hubo un error en la búsqueda.');
    }
  }

  main();