# App de Registo de Treinos — Projeto Final DAM

Aplicação mobile pessoal para registar treinos realizados. Cada treino tem movimentos com os valores feitos (distância, tempo, calorias, carga, repetições), uma estrutura opcional (tipo, time cap, rondas, trabalho/descanso), um resultado e notas.

Projeto individual da unidade curricular Desenvolvimento de Aplicações Móveis. Feito com React Native, Expo e TypeScript.

> **Estado:** Fase 1 em desenvolvimento.

## Como correr

```bash
npm install
npx expo start      # depois "w" para web, ou ler o QR code com o Expo Go
npx tsc --noEmit    # verificação de tipos
npx expo lint       # lint
```

Os dados são carregados a partir de uma seed sempre que a app arranca. As alterações feitas durante a sessão perdem-se ao fechar a app (a persistência está prevista para a fase 3).

## Funcionalidades (fase 1)

- **Home:** os 3 treinos mais recentes, com expansão para os treinos dos últimos 7 dias. Acesso ao histórico completo e a um novo treino.
- **Histórico:** lista de todos os treinos, ordenada por data, com pesquisa por nome e filtro por período (Todos, 7 dias, 30 dias). Tocar num treino abre-o para edição; o botão de lixo elimina-o depois de uma confirmação.
- **Treino:** formulário para criar, editar e eliminar um treino:
  - nome e data (não pode ser futura);
  - tipo (For Time, AMRAP, EMOM, Intervalos, Outro);
  - estrutura (time cap, rondas, trabalho e descanso por ronda);
  - movimentos com valores por métrica;
  - resultado e notas.

  Cada campo mostra o seu erro de validação.
- **Picker de movimentos:** pesquisa no catálogo e criação de movimentos novos, escolhendo as métricas que cada um suporta.

## Mapeamento dos requisitos

| Requisito | Implementação | Ficheiro(s) |
|---|---|---|
| ≥3 ecrãs com Stack Navigator no `App.tsx` | Home, Histórico e Treino. O detalhe só de leitura ainda não está implementado; o ecrã Treino serve de detalhe editável. | `App.tsx` |
| Passagem de parâmetros | `workoutId` (opcional) para abrir um treino existente | `src/navigation/types.ts` |
| FlatList com adicionar, eliminar e alterar | Histórico: "+" cria, tocar edita, lixo elimina com confirmação | `src/features/workouts/screens/historyScreen.tsx` |
| Formulário com ≥3 campos validados | Nome, time cap, rondas, trabalho, descanso, resultado e reps extra, com o erro junto a cada campo | `src/features/workouts/validation.ts`, `src/features/workouts/screens/workoutScreen.tsx` |
| Pesquisa ou filtro sem estado duplicado | Só a pesquisa e o período são estado; a lista filtrada é calculada no render | `src/features/workouts/rules.ts` (`filterHistory`), `historyScreen.tsx` |
| `useEffect` com dependências | Histórico: o título acompanha o número de treinos visíveis. Treino: define o título e volta atrás se o treino for eliminado. | `historyScreen.tsx`, `workoutScreen.tsx` |
| ≥3 componentes próprios com props tipadas e tema | `Button`, `Card`, `TextField`, `NumberInput`, `DurationInput`, `DateField`, `FilterChips`, `ToggleChips`, `ConfirmDialog`, `AppHeader`, `IconButton`, `EmptyState`, `WorkoutCard`, `MovementEntry`, `MovementPicker` | `src/components`, `src/features/workouts/components`, `src/theme` |
| Estrutura por features | `components`, `features`, `navigation`, `theme` | `src/` |

## Estrutura

```
App.tsx                  NavigationContainer, Stack e estado da app
src/
  components/            componentes partilhados (botões, campos, diálogo, cabeçalho…)
  features/
    home/                ecrã Home
    workouts/
      screens/           ecrãs Histórico e Treino
      components/        componentes do treino (cartão, movimento, picker)
      types.ts           modelo de dados
      rules.ts           filtros, ordenação e formatação
      validation.ts      validação dos formulários
      metrics.ts         métricas, unidades e conversões
      dates.ts           datas locais
      sampleWorkouts.ts  seed
  navigation/            tipos dos parâmetros de navegação
  theme/                 cores, espaçamentos, tipografia, fontes
```

## Roadmap

| Fase | Âmbito | Estado |
|---|---|---|
| 1 | Requisitos do enunciado, dados em memória com seed | Em curso |
| 2 | Autenticação com Supabase Auth (login social) | Planeada, opcional |
| 3 | Persistência no Supabase, com `user_id` e RLS | Planeada, opcional |

## Uso de IA

A maior parte do código foi escrita pelo autor. O Claude (via Claude Code) foi usado com papéis definidos:

| Modo | Papel do Claude |
|---|---|
| Tutor (por omissão) | Explica conceitos e erros, sem dar a solução final |
| `/debug` | Encontra a causa de um erro e explica-a, sem editar ficheiros |
| `/codereview` | Revê funcionamento, melhorias e segurança, sem editar ficheiros |
| `/collaborate` | Escreve código só depois de o autor aprovar um plano explícito |

No modo `/collaborate`, o Claude escreveu partes específicas do código, sempre depois de o autor aprovar um plano explícito. Exemplos: simplificações de componentes e a validação do formulário. As permissões do Claude Code obrigavam a confirmar cada edição de ficheiro e bloqueavam o `git push`.

A configuração do Claude e o registo de decisões são mantidos localmente e não fazem parte deste repositório. O commit inicial declara a colaboração com os trailers `Co-authored-by: Claude` e `Assisted-by: Claude (…)`.
