<?php

namespace Vanguard\Http\Controllers\Web;

use Dompdf\Dompdf;
use Maatwebsite\Excel\Facades\Excel;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class DownloadController extends Controller
{
    private $tableService;

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
    }

    public function download(Request $request) {
        $data = "";
        switch ($request->filename) {
            case 'CSV': $dwn_mode = "csv";
                $data = $this->downloader_csv($request, "data_export_" . date("Y-m-d"));
                break;
            case 'XLS': $dwn_mode = "xlsx";
                $data = $this->downloader_xlsx($request, "data_export_" . date("Y-m-d"));
                break;
            case 'PDF': $dwn_mode = "pdf";
                $data = $this->downloader_pdf($request);
                break;
            default: $dwn_mode = "";
                break;
        }

        if (empty($dwn_mode)) {
            return "<h1>Incorrect request</h1>";
        }

        // force download
        header("Content-Type: application/force-download");

        header("Content-Disposition: attachment;filename=data_export_" . date("Y-m-d") . "." . $dwn_mode);
        header("Content-Transfer-Encoding: binary");

        echo $data;
        exit;
    }

    /*
     * Prepare Excel writer class
     */
    private function prepare_Excel($post, $filename) {
        $respArray = $this->tableService->getData($post);

        $data = array();
        foreach ($respArray['headers'] as $key => $val) {
            $data[0][$key] = $val->name;
        }

        foreach ($respArray['data'] as $row) {
            $row = (array)$row;
            $tmp_row = [];
            foreach ($respArray['headers'] as $hdr) {
                $tmp_row[] = $row[$hdr->field];
            }
            $data[] = $tmp_row;
        }

        return Excel::create($filename, function($excel) use ($data) {
            $excel->sheet('Sheet1', function($sheet) use ($data) {
                $sheet->fromArray($data, null, 'A1', true, false);
            });
        });
    }

    /*
     * Create data flow for csv file
     */
    private function downloader_csv($post, $filename) {
        $writer = $this->prepare_Excel($post, $filename);
        return $writer->export('csv');
    }

    /*
     * Create data flow for xlsx file
     */
    private function downloader_xlsx($post, $filename) {
        $writer = $this->prepare_Excel($post, $filename);
        return $writer->export('xlsx');
    }

    /*
     * Create data flow for pdf file
     */
    private function downloader_pdf($post) {
        $respArray = $this->tableService->getData($post);

        $html = "<table style='border-collapse: collapse;' width=\"100%\" page-break-inside: auto;>";

        $html .= "<thead><tr>";
        foreach ($respArray['headers'] as $hdr) {
            if ($hdr->web == 'Yes') {
                $html .= "<th style='border: solid 1px #000;padding: 3px 5px;background-color: #AAA;'>".$hdr->name."</th>";
            }
        }
        $html .= "</tr></thead>";

        $html .= "<tbody>";
        foreach ($respArray['data'] as $row) {
            $row = (array)$row;
            $html .= "<tr>";
            foreach ($respArray['headers'] as $hdr) {
                if ($hdr->web == 'Yes') {
                    $html .= "<td style='border: solid 1px #000;padding: 3px 5px;'>".$row[$hdr->field]."</td>";
                }
            }
            $html .= "</tr>";
        }
        $html .= "</tbody>";
        $html .= "</table>";

        $pdf = new Dompdf();
        $pdf->setPaper("A4", "landscape");
        $pdf->loadHtml($html);
        $pdf->render();

        return $pdf->output();
    }
}
