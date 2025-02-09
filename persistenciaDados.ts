import * as fs from 'fs';
import { Perfil, Publicacao } from './perfil';


export class PersistenciaDeDados {
    static salvarPerfis(perfis: Perfil[]): void {
        const dados = JSON.stringify(perfis, (key, value) => {
            if (key.startsWith('__')) return undefined; // Remover atributos privados
            return value;
        });
        fs.writeFileSync('perfis.json', dados);
    }

    static salvarPublicacoes(publicacoes: Publicacao[]): void {
        const dados = JSON.stringify(publicacoes, (key, value) => {
            if (key.startsWith('__')) return undefined; // Remover atributos privados
            return value;
        });
        fs.writeFileSync('publicacoes.json', dados);
    }

    static recuperarPerfis(): Perfil[] {
        const dados = fs.readFileSync('perfis.json', 'utf-8');
        const perfis = JSON.parse(dados);
        return perfis.map((perfil: any) => new Perfil(perfil.id, perfil.apelido, perfil.foto, perfil.email));
    }

    static recuperarPublicacoes(): Publicacao[] {
        const dados = fs.readFileSync('publicacoes.json', 'utf-8');
        const publicacoes = JSON.parse(dados);
        return publicacoes.map((publicacao: any) => new Publicacao(publicacao.id, publicacao.conteudo, publicacao.perfil));
    }
}
