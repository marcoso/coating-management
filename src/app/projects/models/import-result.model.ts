import { ProjectAreaBatchNotFound } from "./project-area-batch-not-found.model";
import { ProjectAreaMeasurement } from "./project-area-measurement.model";

export class ImportResult {
    measurements: ProjectAreaMeasurement[];
    projectAreaBatchsNotFound: ProjectAreaBatchNotFound[] = [];
    message: string;
}