export class ProjectAreaMeasurement
{
    projectAreaMeasurementId: string;
    projectAreaId: string;
    batch: number;
    readingsInBatch: number;
    tubeNumber: number;
    elevation: number;
    tubeSection?: number;
    value: number;
    measurementDateTime: string;
    status: number; // 0 = Enabled, 1 = Disabled
    createdAt: string;
    updatedAt: string;
}