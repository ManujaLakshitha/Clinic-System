package services

import "clinic-system/repository"

func SaveVisitData(drugs, tests, notes []string) (int, error) {

	visitID, err := repository.CreateVisit()
	if err != nil {
		return 0, err
	}

	for _, d := range drugs {
		if err := repository.SaveDrug(visitID, d); err != nil {
			return 0, err
		}
	}

	for _, t := range tests {
		if err := repository.SaveLabTest(visitID, t); err != nil {
			return 0, err
		}
	}

	for _, n := range notes {
		if err := repository.SaveNote(visitID, n); err != nil {
			return 0, err
		}
	}

	return visitID, nil
}
