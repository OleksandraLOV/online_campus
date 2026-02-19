import { ReferencesService } from './references.service';
export declare class ReferencesController {
    private referencesService;
    constructor(referencesService: ReferencesService);
    getGroups(): import("../common/types/entities").Group[];
    getClassrooms(): import("../common/types/entities").Classroom[];
    getDepartments(): import("../common/types/entities").Department[];
    getFaculties(): import("../common/types/entities").Faculty[];
}
