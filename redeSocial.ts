import {Perfil, PerfilAvancado, Publicacao, PublicacaoAvancada, Interacao, TipoInteracao} from './perfil';
import {PerfilJaCadastradoError, PerfilNaoAutorizadoError, PerfilInativoError, AmizadeJaExistenteError} from './excecoes';

export class RedeSocial {
    private perfis: Perfil[];
    private publicacoes: Publicacao[];
    private solicitacoesAmizade: Map<Perfil, Perfil>;

    constructor() {
        this.perfis = [];
        this.publicacoes = [];
        this.solicitacoesAmizade = new Map<Perfil, Perfil>();
    }

    adicionarPerfil(perfil: Perfil): void {
        if (this.perfis.find(p => p['id'] === perfil['id'] || p['email'] === perfil['email'])) {
            throw new PerfilJaCadastradoError('Perfil com ID ou email duplicado.');
        }
         this.perfis.push(perfil);
    }

    buscarPerfil(id?: string, apelido?: string, email?: string): Perfil | null {
        return this.perfis.find(perfil => perfil['id'] === id || perfil['apelido'] === apelido || perfil['email'] === email) || null;
    }

    listarPerfis(): Perfil[] {
        return this.perfis;
    }

    ativarDesativarPerfil(perfilAvancado: PerfilAvancado, perfil: Perfil): void {
        if (!(perfilAvancado instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError('Perfil não autorizado para ativar/desativar outro perfil.');
        }
        perfilAvancado.habilitarDesabilitarPerfil(perfil);
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        const perfil = publicacao['perfil'];
        if (perfil['status'] === 'inativo') {
            throw new PerfilInativoError('Perfis inativos não podem criar publicações.');
        }
        this.publicacoes.push(publicacao);
    }

    listarPublicacoes(): Publicacao[] {
        return this.publicacoes.sort((a, b) => b['dataHora'].getTime() - a['dataHora'].getTime());
    }

    enviarSolicitacaoAmizade(perfilRemetente: Perfil, perfilDestinatario: Perfil): void {
        if (perfilRemetente.listarAmigos().includes(perfilDestinatario)) {
            throw new AmizadeJaExistenteError('Os perfis já são amigos.');
        }
        this.solicitacoesAmizade.set(perfilDestinatario, perfilRemetente);
    }

    aceitarSolicitacao(perfilDestinatario: Perfil): void {
        const perfilRemetente = this.solicitacoesAmizade.get(perfilDestinatario);
        if (perfilRemetente) {
            if (perfilDestinatario.listarAmigos().includes(perfilRemetente)) {
                throw new AmizadeJaExistenteError('Os perfis já são amigos.');
            }
            perfilDestinatario.adicionarAmigo(perfilRemetente);
            perfilRemetente.adicionarAmigo(perfilDestinatario);
            this.solicitacoesAmizade.delete(perfilDestinatario);
        }
    }

    recusarSolicitacao(perfilDestinatario: Perfil): void {
        this.solicitacoesAmizade.delete(perfilDestinatario);
    }
}