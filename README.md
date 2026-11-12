# App de Registo de Treinos — Projeto Final DAM

Aplicação mobile pessoal para planear treinos e registar o que foi realmente feito. Cada treino é composto por exercícios, prescritos com objetivos (distância, tempo, repetições, carga, calorias), e o registo guarda o valor atingido em cada um.

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

- **Home:** próximos treinos e histórico recente, com expansão e acesso à lista completa. Botão "Registar".
- **Treinos:** lista com filtros (Próximos, Concluídos, Não feitos, Todos) e pesquisa por nome.
- **Detalhe:** exercícios agrupados por movimento, com o prescrito e o realizado lado a lado.
- **Registar treino:** preencher o realizado em cada série, adicionar notas e concluir.
- **Gerir treinos:** criar, editar, eliminar e duplicar treinos.

## Mapeamento dos requisitos

| Requisito | Implementação | Ficheiro(s) |
|---|---|---|
| ≥3 ecrãs com Stack Navigator no `App.tsx` | Home, Treinos, Detalhe, Registar, Gerir, formulários | `App.tsx` |
| Passagem de parâmetros | `workoutId`, `initialFilter`, `exerciseId` | `src/navigation/` |
| FlatList com adicionar, eliminar e alterar | Gerir treinos | _a preencher_ |
| Formulário com ≥3 campos validados | Formulário de treino e de exercício | _a preencher_ |
| Pesquisa ou filtro sem estado duplicado | Ecrã Treinos (valores calculados no render) | _a preencher_ |
| `useEffect` com dependências | _a definir_ | _a preencher_ |
| ≥3 componentes próprios com props tipadas e tema | `src/components`, `src/theme` | _a preencher_ |
| Estrutura por features | `components`, `features`, `navigation`, `theme` | `src/` |

## Estrutura

```
App.tsx
src/
  components/    componentes partilhados
  features/      ecrãs, componentes e lógica por funcionalidade
  navigation/    tipos dos parâmetros de navegação
  theme/         cores, espaçamentos, tipografia
docs/
  DECISIONS.md   registo de decisões
```

## Roadmap

| Fase | Âmbito | Estado |
|---|---|---|
| 1 | Requisitos do enunciado, dados em memória com seed | Em curso |
| 2 | Autenticação com Supabase Auth (login social) | Planeada, opcional |
| 3 | Persistência no Supabase, com `user_id` e RLS | Planeada, opcional |

## Uso de IA

O código é escrito pelo autor. O Claude (via Claude Code) é usado com papéis definidos e registados no repositório (`CLAUDE.md`, `.claude/`).

| Modo | Papel do Claude |
|---|---|
| Tutor (por omissão) | Explica conceitos e erros, sem dar a solução final |
| `/debug` | Encontra a causa de um erro e explica-a, sem editar ficheiros |
| `/codereview` | Revê funcionamento, melhorias e segurança, sem editar ficheiros |
| `/collaborate` | Escreve código só depois de o autor aprovar um plano explícito |

As permissões do Claude Code (`.claude/settings.json`) obrigam a confirmação antes de qualquer edição de ficheiros ou commit, e bloqueiam o `git push`.

Cada commit declara a assistência recebida:
- `Co-authored-by: Claude` quando o código foi escrito pelo Claude (`/collaborate`), sempre num commit separado;
- `Assisted-by: Claude (tutor|debug|codereview|design)` quando o código foi escrito pelo autor com apoio do Claude.

As decisões de design e arquitetura estão em [`docs/DECISIONS.md`](docs/DECISIONS.md).
