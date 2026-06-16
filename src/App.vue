<template>
  <div class="h-screen flex bg-slate-900 text-white font-sans overflow-hidden">
    <aside
      class="w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col"
    >
      <h1 class="text-2xl font-black text-indigo-400 mb-10 tracking-tighter">
        STUDY APP
      </h1>
      <nav class="space-y-4">
        <button
          @click="irParaCursos"
          class="w-full text-left p-4 rounded-xl bg-indigo-600 font-bold hover:bg-indigo-500 transition"
        >
          Meus Cursos
        </button>
        <button
          @click="tela = 'lixeira'"
          class="w-full text-left p-4 rounded-xl bg-red-900/30 font-bold hover:bg-red-900/50 transition"
        >
          Lixeira
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-10 overflow-y-auto">
      <div
        v-if="itemParaExcluir !== null"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      >
        <div
          class="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full"
        >
          <h3 class="text-xl font-bold mb-4">
            {{
              tipoExclusao === "curso"
                ? "Deseja excluir este curso?"
                : tipoExclusao === "aula"
                  ? 'Deseja excluir a aula "' + itemParaExcluir.titulo + '"?'
                  : tipoExclusao === "restaurar"
                    ? "Deseja restaurar este item?"
                    : "Deseja excluir este item permanentemente?"
            }}
          </h3>
          <div class="flex gap-3">
            <button
              @click="itemParaExcluir = null"
              class="flex-1 bg-slate-700 py-2 rounded-lg font-bold"
            >
              Cancelar
            </button>
            <button
              @click="confirmarExclusao"
              class="flex-1 bg-red-600 py-2 rounded-lg font-bold"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <div v-if="tela === 'lista'" class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Meus Cursos</h2>
          <div
            class="flex flex-col gap-2 bg-slate-800 p-4 rounded-xl border border-slate-700"
          >
            <input
              v-model="novoCurso.nome"
              type="text"
              placeholder="Nome do curso..."
              class="w-full bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg outline-none focus:border-indigo-500"
            />
            <label
              class="cursor-pointer bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm text-center"
            >
              {{ novoCurso.img ? "Capa OK" : "Selecionar Capa" }}
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
              />
            </label>
            <button
              @click="adicionarCurso"
              class="bg-emerald-600 py-2 rounded-lg font-bold hover:bg-emerald-700"
            >
              + Adicionar
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="c in cursos"
            :key="c.id"
            class="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col"
          >
            <img :src="c.img" v-if="c.img" class="w-full h-40 object-cover" />
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="text-lg font-bold truncate">{{ c.nome }}</h3>
              <p class="text-slate-400 text-xs mb-4">
                {{ c.aulas.filter((a) => a.concluida).length }} /
                {{ c.aulas.length }} aulas concluídas
              </p>
              <div class="flex gap-2 mt-auto">
                <button
                  @click="abrirCurso(c)"
                  class="flex-1 bg-indigo-600 py-2 rounded-lg font-bold text-sm hover:bg-indigo-500"
                >
                  Acessar
                </button>
                <button
                  @click="iniciarExclusao(c, 'curso')"
                  class="px-4 py-2 bg-slate-700 rounded-lg text-red-400 font-bold text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tela === 'lixeira'" class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-red-400 mb-8">Lixeira</h2>
        <div class="space-y-3">
          <div
            v-for="(item, i) in lixeira"
            :key="'lix-' + i"
            class="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700"
          >
            <span
              >{{ item.nome || item.titulo }}
              <span class="text-xs text-slate-500 uppercase"
                >({{ item.tipo }})</span
              ></span
            >
            <div class="flex gap-2">
              <button
                @click="iniciarExclusao(i, 'restaurar')"
                class="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-bold"
              >
                Restaurar
              </button>
              <button
                @click="iniciarExclusao(i, 'limpar')"
                class="px-4 py-2 bg-red-600 rounded-lg text-xs font-bold"
              >
                Excluir Definitivo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tela === 'detalhe'" class="max-w-5xl mx-auto">
        <button
          @click="irParaCursos"
          class="mb-6 text-slate-400 hover:text-white"
        >
          ← Voltar
        </button>
        <h2 class="text-3xl font-bold mb-6">{{ cursoAtivo.nome }}</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            class="aspect-video bg-slate-950 rounded-2xl border-4 border-slate-700 flex flex-col items-center justify-center p-6 text-center"
          >
            <h3 class="text-xl font-bold mb-2">Aula Selecionada</h3>
            <p class="text-indigo-400 font-bold mb-6 text-lg">
              {{ nomeAulaAtiva }}
            </p>
            <button
              @click="abrirNoNavegador(videoAtivo)"
              class="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg"
            >
              Assistir no Navegador
            </button>
          </div>
          <div class="space-y-6">
            <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h4 class="font-bold mb-3">Adicionar nova aula</h4>
              <div class="flex gap-2">
                <input
                  v-model="novaAula.titulo"
                  placeholder="Nome"
                  class="flex-1 bg-slate-900 p-2 rounded-lg border border-slate-700 outline-none"
                />
                <input
                  v-model="novaAula.id"
                  placeholder="ID (Youtube)"
                  class="w-20 bg-slate-900 p-2 rounded-lg border border-slate-700 outline-none"
                />
                <button
                  @click="adicionarAula"
                  class="bg-indigo-600 px-4 rounded-lg font-bold hover:bg-indigo-500"
                >
                  +
                </button>
              </div>
            </div>
            <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h3 class="font-bold mb-4">Aulas do curso</h3>
              <div class="space-y-2">
                <div
                  v-for="aula in cursoAtivo.aulas"
                  :key="aula.id"
                  :class="[
                    'p-3 rounded-xl flex items-center gap-3 transition-all border',
                    videoAtivo === aula.id
                      ? 'bg-indigo-900/50 border-indigo-500'
                      : 'bg-slate-700/30 border-transparent',
                  ]"
                >
                  <button
                    @click="toggleConcluida(aula)"
                    :class="[
                      'w-6 h-6 rounded border flex items-center justify-center',
                      aula.concluida
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-500',
                    ]"
                  >
                    <span v-if="aula.concluida" class="text-white text-xs"
                      >✓</span
                    >
                  </button>
                  <span class="text-sm truncate flex-1">{{ aula.titulo }}</span>
                  <div class="flex gap-2">
                    <button
                      @click="videoAtivo = aula.id"
                      :class="[
                        'px-3 py-1 rounded-lg text-xs font-bold',
                        videoAtivo === aula.id
                          ? 'bg-indigo-500'
                          : 'bg-slate-600 hover:bg-slate-500',
                      ]"
                    >
                      Selecionar
                    </button>
                    <button
                      @click="iniciarExclusao(aula, 'aula')"
                      class="px-2 py-1 bg-slate-600 rounded text-xs font-bold text-red-400 hover:bg-red-900/50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const tela = ref("lista");
const cursos = ref(JSON.parse(localStorage.getItem("db") || "[]"));
const lixeira = ref(JSON.parse(localStorage.getItem("lixeira") || "[]"));

const novoCurso = reactive({ nome: "", img: "" });
const cursoAtivo = ref(null);
const videoAtivo = ref("");
const novaAula = reactive({ titulo: "", id: "" });
const itemParaExcluir = ref(null);
const tipoExclusao = ref("");

const nomeAulaAtiva = computed(() => {
  const aula = cursoAtivo.value?.aulas.find((a) => a.id === videoAtivo.value);
  return aula ? aula.titulo : "Nenhuma selecionada";
});

const salvar = () => {
  localStorage.setItem("db", JSON.stringify(cursos.value));
  localStorage.setItem("lixeira", JSON.stringify(lixeira.value));
};

const toggleConcluida = (aula) => {
  aula.concluida = !aula.concluida;
  salvar();
};

const abrirNoNavegador = (id) => {
  const aula = cursoAtivo.value.aulas.find((a) => a.id === id);
  if (aula)
    window.open(`https://www.youtube.com/watch?v=${aula.youtubeId}`, "_blank");
};

const adicionarCurso = () => {
  if (novoCurso.nome) {
    cursos.value.push({
      id: Date.now(),
      nome: novoCurso.nome,
      img: novoCurso.img,
      aulas: [],
    });
    salvar();
    novoCurso.nome = "";
    novoCurso.img = "";
  }
};

const adicionarAula = () => {
  if (novaAula.titulo && novaAula.id) {
    cursoAtivo.value.aulas.push({
      id: Date.now().toString() + Math.random(),
      titulo: novaAula.titulo,
      youtubeId: novaAula.id,
      concluida: false,
    });
    salvar();
    novaAula.titulo = "";
    novaAula.id = "";
  }
};

const abrirCurso = (c) => {
  cursoAtivo.value = c;
  tela.value = "detalhe";
  videoAtivo.value = c.aulas?.length > 0 ? c.aulas[0].id : "";
};

const irParaCursos = () => {
  tela.value = "lista";
  cursoAtivo.value = null;
  videoAtivo.value = "";
};

const iniciarExclusao = (item, tipo) => {
  itemParaExcluir.value = item;
  tipoExclusao.value = tipo;
};

const confirmarExclusao = () => {
  if (tipoExclusao.value === "curso") {
    lixeira.value.push({ ...itemParaExcluir.value, tipo: "curso" });
    cursos.value = cursos.value.filter(
      (c) => c.id !== itemParaExcluir.value.id,
    );
  } else if (tipoExclusao.value === "aula") {
    cursoAtivo.value.aulas = cursoAtivo.value.aulas.filter(
      (a) => a.id !== itemParaExcluir.value.id,
    );
    lixeira.value.push({
      ...itemParaExcluir.value,
      tipo: "aula",
      cursoId: cursoAtivo.value.id,
    });
    if (videoAtivo.value === itemParaExcluir.value.id) videoAtivo.value = "";
  } else if (tipoExclusao.value === "restaurar") {
    const item = lixeira.value.splice(itemParaExcluir.value, 1)[0];
    if (item.tipo === "curso") cursos.value.push(item);
    else {
      const c = cursos.value.find((x) => x.id === item.cursoId);
      if (c) c.aulas.push(item);
    }
  } else if (tipoExclusao.value === "limpar") {
    lixeira.value.splice(itemParaExcluir.value, 1);
  }
  salvar();
  itemParaExcluir.value = null;
};

const handleFileUpload = (e) => {
  const f = e.target.files[0];
  if (f) {
    const r = new FileReader();
    r.onload = (e) => (novoCurso.img = e.target.result);
    r.readAsDataURL(f);
  }
};
</script>
