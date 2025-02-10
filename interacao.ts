import * as readline from 'readline';
import { RedeSocial } from './redeSocial';
import { Perfil, PerfilAvancado, Publicacao, PublicacaoAvancada, Interacao, TipoInteracao} from './perfil';
import { AmizadeJaExistenteError, PerfilInativoError, PerfilJaCadastradoError, PerfilNaoAutorizadoError, InteracaoDuplicadaError } from './excecoes';
import { PersistenciaDeDados } from './persistenciaDados';

export class RedeSocialInterativa {
    private redeSocial: RedeSocial;
    private rl: readline.Interface;

    constructor() {
        this.redeSocial = new RedeSocial();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    iniciar(): void {
        this.menuPrincipal();
    }

    private menuPrincipal(): void {
        console.log('\n--- Menu Principal ---');
        console.log('1. Gerenciamento de Perfis');
        console.log('2. Gerenciamento de Publicações');
        console.log('3. Gerenciamento de Solicitações');
        console.log('4. Sair');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.menuPerfis();
                    break;
                case '2':
                    this.menuPublicacoes();
                    break;
                case '3':
                    this.menuSolicitacoes();
                    break;
                case '4':
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPrincipal();
                    break;
            }
        });
    }

    private menuPerfis(): void {
        console.log('\n--- Gerenciamento de Perfis ---');
        console.log('1. Adicionar Perfil');
        console.log('2. Adicionar Perfil Avançado');
        console.log('3. Listar Perfis');
        console.log('4. Ativar/Desativar Perfil');
        console.log('5. Salvar');
        console.log('6. Recuperar');
        console.log('7. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPerfil(false); // Adiciona perfil normal
                    break;
                case '2':
                    this.adicionarPerfil(true);  // Adiciona perfil avançado
                    break;
                case '3':
                    this.listarPerfis();
                    break;
                case '4':
                    this.ativarDesativarPerfil();
                    break;
                case '5':
                    this.salvarPerfis();
                    break;
                case '6':
                    this.recuperarPerfis();
                    break;
                case '7':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPerfis();
                    break;
            }
        });
    }

    private adicionarPerfil(avancado: boolean): void {
        this.rl.question('ID: ', (id) => {
            this.rl.question('Apelido: ', (apelido) => {
                this.rl.question('Foto (emoji): ', (foto) => {
                    this.rl.question('Email: ', (email) => {
                        let perfil;
                        if (avancado) {
                            perfil = new PerfilAvancado(id, apelido, foto, email);
                        } else {
                            perfil = new Perfil(id, apelido, foto, email);
                        }
    
                        try {
                            this.redeSocial.adicionarPerfil(perfil);
                            console.log('Perfil adicionado com sucesso!');
                            this.salvarPerfis();
                            this.menuPerfis();
                        } catch (erro) {
                            if (erro instanceof PerfilJaCadastradoError) {
                                console.error(erro.message);
                            } else {
                                console.error("Ocorreu um erro desconhecido:", erro);
                            }
                            this.menuPerfis();
                        }
                    });
                });
            });
        });
    }

    private listarPerfis(): void {
        const perfis = this.redeSocial.listarPerfis();
        if (perfis.length === 0) {
            console.log('Nenhum perfil cadastrado.');
        } else {
            perfis.forEach(perfil => {
                const tipoPerfil = perfil instanceof PerfilAvancado ? 'Avançado' : 'Normal';
                console.log(`ID: ${perfil.getId()}, Apelido: ${perfil.getApelido()}, Email: ${perfil.getEmail()}, Tipo: ${tipoPerfil}, Ativo: ${perfil.estaAtivo()}`);
            });
        }
        this.menuPerfis();
    }

    private ativarDesativarPerfil(): void {
        this.rl.question('Email do perfil: ', (emailAvancado) => {
            const perfilAvancado = this.redeSocial.buscarPerfil(undefined, undefined, emailAvancado) as PerfilAvancado;
            if (perfilAvancado) {
                this.rl.question('Email do perfil a ser ativado/desativado: ', (email) => {
                    const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
                    try {
                        if (perfil) {
                            this.redeSocial.ativarDesativarPerfil(perfilAvancado, perfil);
                            console.log('Perfil ativado/desativado com sucesso!');
                            this.menuPerfis();
                        } else {
                            console.error("Perfil não encontrado");
                            this.menuPerfis();
                        }
                    } catch (erro) {
                        if (erro instanceof PerfilNaoAutorizadoError) {
                            console.error(erro.message);
                        } else {
                            console.error("Ocorreu um erro desconhecido!");
                        }
                        this.menuPerfis();
                    }
                });
            } else {
                console.error('Perfil não encontrado ou não autorizado.');
                this.menuPerfis();
            }
        });
    }

    private salvarPerfis(): void {
        try {
            PersistenciaDeDados.salvarPerfis(this.redeSocial.listarPerfis());
            console.log("Perfis salvos automaticamente.");
            this.menuPerfis();
        } catch (erro) {
            console.error("Erro ao salvar perfis.");
            this.menuPerfis();
        }
    }

    private recuperarPerfis(): void {
        try {
            PersistenciaDeDados.recuperarPerfis();
            console.log("Perfis recuperados com sucesso.");
            this.menuPerfis();
        } catch (erro) {
            console.error("Erro ao recuperar perfis.");
            this.menuPerfis();
        }
    }

    private menuPublicacoes(): void {
        console.log('\n--- Gerenciamento de Publicações ---');
        console.log('1. Adicionar Publicação');
        console.log('2. Listar Publicações');
        console.log('3. Gerenciar Interações'); // Nova opção
        console.log('4. Salvar');
        console.log('5. Recuperar');
        console.log('6. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPublicacao(); // Chama a função adicionarPublicacao sem parâmetros
                    break;
                case '2':
                    this.listarPublicacoes();
                    break;
                case '3':
                    this.menuInteracoes(); // Chama o menu de interações
                    break;
                case '4':
                    this.salvarPublicacoes();
                    break;
                case '5':
                    this.recuperarPublicacoes();
                    break;
                case '6':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPublicacoes();
                    break;
            }
        });
    }
    
    private adicionarPublicacao(): void {
        this.rl.question('Publicação Avançada? (Sim/Não): ', (avancadaResposta) => {
            const avancada = avancadaResposta.toUpperCase() === 'SIM';
    
            this.rl.question('Usar ID ou Email para identificar o perfil? (ID/Email): ', (opcao) => {
                let perfil: Perfil | null = null;  // Inicializar como null
    
                if (opcao.toUpperCase() === 'ID') {
                    this.rl.question('ID do perfil: ', (id) => {
                        perfil = this.redeSocial.buscarPerfil(id); // Busca por ID
                        this.continuarAdicionandoPublicacao(perfil, avancada);
                    });
                } else if (opcao.toUpperCase() === 'EMAIL') {
                    this.rl.question('Email do perfil: ', (email) => {
                        perfil = this.redeSocial.buscarPerfil(undefined, email); // Busca por email
                        this.continuarAdicionandoPublicacao(perfil, avancada);
                    });
                } else {
                    console.log('Opção inválida.');
                    this.menuPublicacoes();
                }
            });
        });
    }
    
    private continuarAdicionandoPublicacao(perfil: Perfil | null, avancada: boolean): void {
        if (perfil) {
            this.rl.question('Conteúdo: ', (conteudo) => {
                try {
                    let publicacao;
                    if (avancada) {
                        publicacao = new PublicacaoAvancada(Date.now().toString(), conteudo, perfil);  // Passar o perfil
                    } else {
                        publicacao = new Publicacao(Date.now().toString(), conteudo, perfil);  // Passar o perfil
                    }
                    this.redeSocial.adicionarPublicacao(publicacao);
                    console.log('Publicação adicionada com sucesso!');
                    this.menuPublicacoes();
                } catch (erro) {
                    if (erro instanceof PerfilInativoError) {
                        console.error(erro.message);
                    } else {
                        console.error("Ocorreu um erro desconhecido:", erro);
                    }
                    this.menuPublicacoes();
                }
            });
        } else {
            console.error('Perfil não encontrado.');
            this.menuPublicacoes();
        }
    }

    private listarPublicacoes(): void {
        const publicacoes = this.redeSocial.listarPublicacoes();
        console.log('\nPublicações:');
        publicacoes.forEach(pub => {
            if (pub && pub['perfil'] && pub['perfil'] instanceof Perfil) {
                console.log(`${pub['perfil'].getId()}- ${pub['perfil'].getApelido()}: [${pub['dataHora']}] ${pub['conteudo']}`);
            } else {
                console.log("Publicação com perfil indefinido ou inválido.");
            }
        });
        this.menuPublicacoes();
    }

    private salvarPublicacoes(): void {
        try {
            PersistenciaDeDados.salvarPublicacoes(this.redeSocial.listarPublicacoes());
            console.log("Publicações salvas com sucesso.");
            this.menuPublicacoes();
        } catch (erro) {
            console.error("Erro ao salvar publicações.");
            this.menuPublicacoes();
        }
    }

    private recuperarPublicacoes(): void {
        try {
            PersistenciaDeDados.recuperarPublicacoes();
            console.log("Publicações recuperadas com sucesso.");
            this.menuPublicacoes();
        } catch (erro) {
            console.error("Erro ao recuperar publicações.");
            this.menuPublicacoes();
        }
    }


    private menuSolicitacoes(): void {
        console.log('\n--- Gerenciamento de Solicitações ---');
        console.log('1. Enviar Solicitação de Amizade');
        console.log('2. Aceitar Solicitação');
        console.log('3. Recusar Solicitação');
        console.log('4. Listar amigos');
        console.log('5. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.enviarSolicitacaoAmizade();
                    break;
                case '2':
                    this.aceitarSolicitacao();
                    break;
                case '3':
                    this.recusarSolicitacao();
                    break;
                case '4':
                    this.listarAmizades();
                    break;
                case '5':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuSolicitacoes();
                    break;
            }
        });
    }

    private enviarSolicitacaoAmizade(): void {
        this.rl.question('Email do perfil remetente: ', (Email) => {
            const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilRemetente) {
                this.rl.question('Email do perfil destinatário: ', (Email) => {
                    const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
                    if (perfilDestinatario) {
                        try {
                            this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);                            this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);
                            console.log("Solicitação de amizade enviada!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao enviar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil destinatário não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil remetente não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }

    private aceitarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (emailDestinatario) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, emailDestinatario);
            if (perfilDestinatario) {
                this.rl.question('Email do perfil a ser aceito: ', (emailRemetente) => {
                    const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, emailRemetente);
                    if (perfilRemetente) {
                        try {
                            // Chama o método de aceitar solicitação
                            this.redeSocial.aceitarSolicitacao(perfilDestinatario);
                            console.log("Solicitação de amizade aceita!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao aceitar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil remetente não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil destinatário não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
    private recusarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (emailDestinatario) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, emailDestinatario);
            if (perfilDestinatario) {
                this.rl.question('Email do perfil a ser recusado: ', (emailRemetente) => {
                    const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, emailRemetente);
                    if (perfilRemetente) {
                        try {
                            // Chama o método de recusar solicitação
                            this.redeSocial.recusarSolicitacao(perfilDestinatario);
                            console.log("Solicitação de amizade recusada!");
                            this.menuSolicitacoes();
                        } catch (erro) {
                            console.error("Erro ao recusar solicitação de amizade:", erro);
                            this.menuSolicitacoes();
                        }
                    } else {
                        console.error("Perfil remetente não encontrado.");
                        this.menuSolicitacoes();
                    }
                });
            } else {
                console.error("Perfil destinatário não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
    private listarAmizades(): void {
        console.log("Listando amizades...");
        this.rl.question('Email do perfil: ', (email) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
            if (perfil) {
                const amigos = this.redeSocial.listarAmigos(perfil);
                if (amigos.length === 0) {
                    console.log("Nenhuma amizade encontrada.");
                } else {
                    amigos.forEach(amigo => console.log(`Amigo: ${amigo.getApelido()}`));
                }
                this.menuSolicitacoes();
            } else {
                console.error("Perfil não encontrado.");
                this.menuSolicitacoes();
            }
        });
    }
    
    // Nova parte de gerenciamento 
    private menuInteracoes(): void {
        console.log('\n--- Gerenciamento de Interações ---');
        console.log('1. Adicionar Interação');
        console.log('2. Voltar ao Menu de Publicações');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarInteracao();
                    break;
                case '2':
                    this.menuPublicacoes();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuInteracoes();
                    break;
            }
        });
    }

    private adicionarInteracao(): void {
        this.rl.question('Email do perfil: ', (email) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
            if (perfil) {
                this.rl.question('ID da publicação: ', (id) => {
                    const publicacao = this.redeSocial.buscarPublicacaoPorId(id);
                    if (publicacao) {
                        if (publicacao instanceof PublicacaoAvancada) { // Verifica se é uma publicação avançada
                            this.rl.question('Tipo de interação (Curtida ou Não Curtida): ', (tipo) => {
                                try {
                                    const interacao = new Interacao(Date.now().toString(), tipo === 'Curtida' ? TipoInteracao.Curtir : TipoInteracao.NaoCurtir, perfil);
                                    publicacao.adicionarInteracao(interacao); // Adiciona a interação à instância da publicação
                                    console.log('Interação adicionada com sucesso!');
                                } catch (erro) {
                                    if (erro instanceof InteracaoDuplicadaError) {
                                        console.log('Interação duplicada.');
                                    } else {
                                        console.error("Ocorreu um erro desconhecido:", erro);
                                    }
                                } finally {
                                    this.menuPublicacoes();
                                }
                            });
                        } else {
                            console.log('A publicação não é do tipo avançada e não pode ter interações.');
                            this.menuPublicacoes();
                        }
                    } else {
                        console.log('Publicação não encontrada.');
                        this.menuPublicacoes();
                    }
                });
            } else {
                console.log('Perfil não encontrado.');
                this.menuPublicacoes();
            }
        });
    }
}




