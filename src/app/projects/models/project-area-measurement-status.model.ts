export class ProjectAreaMeasurementStatus {
    projectAreaMeasurementId: string;
    projectAreaId: string;
    value: number;
    status: number; // 0 = Enabled, 1 = Disabled

    constructor(
        projectAreaMeasurementId: string,
        projectAreaId: string,
        value: number,
        status: number) {
            this.projectAreaMeasurementId = projectAreaMeasurementId;
            this.projectAreaId = projectAreaId;
            this.value = value;
            this.status = status;
    }
}