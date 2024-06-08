export type RootStackParamList = {
    Login: undefined;
    ThroneRoom: { king: King; refreshCourtiers: () => void };
    Court: { kingId: string; refreshCourtiers: () => void };
    Register: undefined;
    Friends: { kingId: string }; 
    EditCourtier: { kingId: string; courtier: Courtier; refreshCourtiers: () => void };
    AddCourtier: { kingId: string; refreshCourtiers: () => void };
};

export type King = {
    id: string;
    title: string;
    password: string;
    name: string;
    lastname: string;
    horn: string;
    scroll: string;
    courtiers?: Courtier[];
    courts?: Court[];
};

export type Courtier = {
    name: string;
    lastname: string;
    horn: string;
    scroll: string;
    courts?: string[];
};

export type Court = {
    courtName: string;
    members: Courtier[];
};
