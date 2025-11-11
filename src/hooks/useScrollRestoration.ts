import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ScrollPosition {
  pathname: string;
  search: string;
  scrollY: number;
  movieId?: number;
  page?: number; // Para Favoritos (paginação)
}

const SCROLL_POSITION_KEY = "scroll_position";

/**
 * Hook para salvar e restaurar a posição de scroll ao navegar entre páginas
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRestored = useRef(false);
  const restoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Salvar posição de scroll antes de sair da página
  const saveScrollPosition = (movieId?: number, page?: number) => {
    const scrollPosition: ScrollPosition = {
      pathname: location.pathname,
      search: location.search,
      scrollY: window.scrollY,
      movieId,
      page,
    };
    sessionStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(scrollPosition));
  };

  // Navegar e salvar posição
  const navigateWithScrollSave = (
    path: string,
    movieId?: number,
    page?: number
  ) => {
    saveScrollPosition(movieId, page);
    navigate(path);
  };

  // Navegar de volta e restaurar posição
  const navigateBackWithRestore = () => {
    const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (saved) {
      try {
        const scrollPosition: ScrollPosition = JSON.parse(saved);
        navigate(`${scrollPosition.pathname}${scrollPosition.search}`);
        // A restauração do scroll será feita pelo useEffect abaixo
        return;
      } catch (error) {
        console.error("Error navigating back:", error);
      }
    }
    // Fallback: navegar para home se não houver posição salva
    navigate("/");
  };

  // Restaurar scroll quando a página carregar (apenas uma vez)
  useEffect(() => {
    // Limpar timeout anterior se existir
    if (restoreTimeoutRef.current) {
      clearTimeout(restoreTimeoutRef.current);
    }

    if (!hasRestored.current) {
      // Aguardar um pouco mais para garantir que os componentes renderizaram
      // Especialmente importante para páginas com dados assíncronos
      restoreTimeoutRef.current = setTimeout(() => {
        const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (!saved) return;

        try {
          const scrollPosition: ScrollPosition = JSON.parse(saved);

          // Função para verificar se podemos restaurar (URL corresponde)
          const canRestore = () => {
            const pathnameMatches =
              scrollPosition.pathname === location.pathname;
            const searchMatches = scrollPosition.search === location.search;
            return pathnameMatches && (searchMatches || !scrollPosition.search);
          };

          // Se o pathname corresponde mas o search não, pode ser que a página ainda não foi restaurada
          // Vamos fazer polling para verificar quando a URL corresponder
          if (
            scrollPosition.pathname === location.pathname &&
            scrollPosition.search &&
            scrollPosition.search !== location.search
          ) {
            // Verificar se há página na URL salva
            const savedParams = new URLSearchParams(scrollPosition.search);
            const savedPage = savedParams.get("page");

            if (savedPage) {
              // Fazer polling para verificar quando a URL for atualizada
              let pollAttempts = 0;
              const maxPollAttempts = 20; // Tentar por até 2 segundos

              const pollForUrlUpdate = () => {
                const currentSearch = window.location.search;
                if (scrollPosition.search === currentSearch) {
                  // URL foi atualizada! Agora podemos restaurar o scroll
                  // Resetar hasRestored para permitir nova tentativa
                  hasRestored.current = false;
                  return;
                }

                if (pollAttempts < maxPollAttempts) {
                  pollAttempts++;
                  restoreTimeoutRef.current = setTimeout(pollForUrlUpdate, 100);
                }
              };

              restoreTimeoutRef.current = setTimeout(pollForUrlUpdate, 100);
              return;
            }
          }

          // Verificar se podemos restaurar agora
          if (canRestore()) {
            // Função para tentar restaurar o scroll com polling
            const tryRestore = (attempts = 0) => {
              const maxAttempts = 60; // Tentar por até 6 segundos (60 * 100ms)

              // Verificar se a URL ainda corresponde (importante para paginação)
              const currentSearch = window.location.search;
              if (
                scrollPosition.search &&
                scrollPosition.search !== currentSearch
              ) {
                // URL ainda não corresponde, aguardar mais um pouco
                if (attempts < maxAttempts) {
                  restoreTimeoutRef.current = setTimeout(() => {
                    tryRestore(attempts + 1);
                  }, 100);
                  return;
                }
              }

              // Tentar scroll até o elemento do filme se tiver movieId
              if (scrollPosition.movieId) {
                const movieElement = document.querySelector(
                  `[data-movie-id="${scrollPosition.movieId}"]`
                ) as HTMLElement;

                if (movieElement) {
                  // Elemento encontrado! Usar scrollIntoView que é mais confiável
                  // Aguardar um pouco para garantir que está completamente renderizado
                  setTimeout(() => {
                    // scrollIntoView vai levar o elemento para a viewport automaticamente
                    // block: "center" centraliza o elemento na tela
                    movieElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "nearest",
                    });

                    // Ajustar um pouco para cima para compensar o header fixo
                    setTimeout(() => {
                      const rect = movieElement.getBoundingClientRect();
                      const headerHeight = 120;

                      // Se o elemento está muito próximo do topo (atrás do header), ajustar
                      if (rect.top < headerHeight) {
                        window.scrollBy({
                          top: rect.top - headerHeight,
                          behavior: "smooth",
                        });
                      }
                    }, 300);
                  }, 100);

                  sessionStorage.removeItem(SCROLL_POSITION_KEY);
                  hasRestored.current = true;
                  return;
                }

                // Se não encontrou o elemento e ainda tem tentativas, tentar novamente
                if (attempts < maxAttempts) {
                  restoreTimeoutRef.current = setTimeout(() => {
                    tryRestore(attempts + 1);
                  }, 100);
                  return;
                }
              }

              // Fallback: restaurar posição exata com scroll suave
              setTimeout(() => {
                window.scrollTo({
                  top: scrollPosition.scrollY,
                  behavior: "smooth",
                });
              }, 100);
              sessionStorage.removeItem(SCROLL_POSITION_KEY);
              hasRestored.current = true;
            };

            // Aguardar um pouco antes de começar (mais tempo para Favoritos com paginação)
            // Verificar se há página na URL (query string)
            const hasPageInUrl = location.search.includes("page=");
            const delay = hasPageInUrl ? 600 : 300;
            restoreTimeoutRef.current = setTimeout(() => {
              // Aguardar múltiplos frames para garantir que o DOM começou a renderizar
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  tryRestore();
                });
              });
            }, delay);
          }
        } catch (error) {
          console.error("Error restoring scroll position:", error);
        }
      }, 300);

      return () => {
        if (restoreTimeoutRef.current) {
          clearTimeout(restoreTimeoutRef.current);
        }
      };
    }
  }, [location.pathname, location.search]);

  // Resetar flag quando mudar de rota
  useEffect(() => {
    hasRestored.current = false;
  }, [location.pathname, location.search]);

  // Função para obter informações salvas (útil para páginas que precisam restaurar estado)
  const getSavedPosition = (): ScrollPosition | null => {
    const saved = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as ScrollPosition;
    } catch {
      return null;
    }
  };

  return {
    saveScrollPosition,
    navigateWithScrollSave,
    navigateBackWithRestore,
    getSavedPosition,
  };
};
