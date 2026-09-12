import type { Player } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { sports } from "./sports";
import { teams } from "./teams";

export const players = [
  { id: createMockId(301), slug: "mateo-rivas", teamId: teams[0].id, sportId: sports[0].id, name: "Mateo Rivas", position: "Delantero", country: "Colombia" },
  { id: createMockId(302), slug: "leo-marin", teamId: teams[1].id, sportId: sports[0].id, name: "Leo Marin", position: "Mediocampista", country: "Colombia" },
  { id: createMockId(303), slug: "simon-cano", teamId: teams[2].id, sportId: sports[0].id, name: "Simon Cano", position: "Defensa", country: "Colombia" },
  { id: createMockId(304), slug: "ivan-torres", teamId: teams[3].id, sportId: sports[0].id, name: "Ivan Torres", position: "Arquero", country: "Ecuador" },
  { id: createMockId(305), slug: "rafa-cortes", teamId: teams[4].id, sportId: sports[0].id, name: "Rafa Cortes", position: "Extremo", country: "Peru" },
  { id: createMockId(306), slug: "dario-vega", teamId: teams[5].id, sportId: sports[0].id, name: "Dario Vega", position: "Volante", country: "Chile" },
  { id: createMockId(307), slug: "nicolas-luna", teamId: teams[6].id, sportId: sports[1].id, name: "Nicolas Luna", position: "Base", country: "Mexico" },
  { id: createMockId(308), slug: "emilio-reyes", teamId: teams[7].id, sportId: sports[1].id, name: "Emilio Reyes", position: "Escolta", country: "Mexico" },
  { id: createMockId(309), slug: "bruno-soto", teamId: teams[8].id, sportId: sports[1].id, name: "Bruno Soto", position: "Alero", country: "Colombia" },
  { id: createMockId(310), slug: "tomas-paz", teamId: teams[9].id, sportId: sports[1].id, name: "Tomas Paz", position: "Pivot", country: "Argentina" },
  { id: createMockId(311), slug: "lucas-ferrer", teamId: teams[10].id, sportId: sports[2].id, name: "Lucas Ferrer", position: "Individual", country: "Chile" },
  { id: createMockId(312), slug: "martin-silva", teamId: teams[11].id, sportId: sports[2].id, name: "Martin Silva", position: "Individual", country: "Uruguay" },
  { id: createMockId(313), slug: "andres-mena", teamId: teams[12].id, sportId: sports[3].id, name: "Andres Mena", position: "Central", country: "Peru" },
  { id: createMockId(314), slug: "felipe-arias", teamId: teams[13].id, sportId: sports[3].id, name: "Felipe Arias", position: "Libero", country: "Colombia" },
  { id: createMockId(315), slug: "diego-pena", teamId: teams[14].id, sportId: sports[4].id, name: "Diego Pena", position: "Pitcher", country: "Republica Dominicana" },
  { id: createMockId(316), slug: "joel-acosta", teamId: teams[15].id, sportId: sports[4].id, name: "Joel Acosta", position: "Bateador", country: "Venezuela" },
  { id: createMockId(317), slug: "camilo-rojas", teamId: teams[16].id, sportId: sports[5].id, name: "Camilo Rojas", position: "Escalador", country: "Colombia" },
  { id: createMockId(318), slug: "esteban-mejia", teamId: teams[17].id, sportId: sports[5].id, name: "Esteban Mejia", position: "Rodador", country: "Ecuador" },
  { id: createMockId(319), slug: "juan-galindo", teamId: teams[18].id, sportId: sports[0].id, name: "Juan Galindo", position: "Delantero", country: "Colombia" },
  { id: createMockId(320), slug: "pablo-nunes", teamId: teams[19].id, sportId: sports[0].id, name: "Pablo Nunes", position: "Mediocampista", country: "Brasil" }
] as const satisfies readonly Player[];
